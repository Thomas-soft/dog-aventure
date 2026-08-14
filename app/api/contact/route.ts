import { NextRequest } from "next/server";

/** Réception du formulaire de contact, relayée vers n8n.
 *
 *  Pourquoi une route du site plutôt qu'un POST direct du navigateur vers n8n :
 *  la CSP du site (docker-compose.yml) porte `connect-src 'self'` et
 *  `form-action 'self'`. Passer par le même domaine ne demande donc AUCUNE
 *  modification de CSP, et l'URL du webhook n'est jamais exposée au client —
 *  un webhook n8n public est un endroit ouvert, autant qu'il reste discret.
 *
 *  Le relais est un simple `fetch` serveur à serveur, hors de portée de la CSP
 *  (qui ne contraint que le navigateur).
 *
 *  ATTENTION : cette route n'existe QUE sur le site déployé. L'aperçu GitHub
 *  Pages est un export statique — le build ne se plaint pas et marque la route
 *  « ƒ (Dynamic) », mais rien n'est écrit dans `out/`. Le formulaire côté
 *  client teste `isStaticPreview` et n'appelle donc jamais cette route là-bas.
 *
 *  Ne PAS ajouter `export const dynamic = "force-dynamic"` : un POST est déjà
 *  dynamique par défaut, et cette ligne fait échouer le build de l'aperçu
 *  (« cannot be used with output: export »). Elle a été essayée, elle a cassé.
 */

const NAME_MAX = 80;
const CONTACT_MAX = 120;
const MESSAGE_MIN = 5;
const MESSAGE_MAX = 2000;

/* Volontairement permissif : le rôle n'est pas de certifier l'adresse, mais
   d'écarter la faute de frappe qui rendrait la réponse impossible. */
const EMAIL = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/** Numéro français : 10 chiffres commençant par 0, ou +33 suivi de 9 chiffres.
 *  Espaces, points, tirets et parenthèses sont retirés avant le test — les
 *  gens écrivent leur numéro de six façons différentes, aucune n'est fausse. */
function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[\s.\-()]/g, "");
  if (/^0\d{9}$/.test(digits)) return digits;
  if (/^\+33\d{9}$/.test(digits)) return `0${digits.slice(3)}`;
  return null;
}

type Cleaned = {
  name: string;
  contact: string;
  contactType: "email" | "phone";
  message: string;
};

function validate(body: unknown): Cleaned | string {
  if (typeof body !== "object" || body === null) return "Requête invalide.";
  const b = body as Record<string, unknown>;

  /* Champ appât : invisible et hors du parcours clavier, un humain ne peut pas
     le remplir. S'il est rempli, c'est un robot — on répond 200 sans rien
     faire, pour ne pas lui apprendre qu'il a été repéré. */
  if (typeof b.website === "string" && b.website.trim() !== "") return "bot";

  const name = typeof b.name === "string" ? b.name.trim() : "";
  const contact = typeof b.contact === "string" ? b.contact.trim() : "";
  const message = typeof b.message === "string" ? b.message.trim() : "";

  if (!name || name.length > NAME_MAX) return "Prénom manquant ou trop long.";
  if (!contact || contact.length > CONTACT_MAX)
    return "Coordonnée manquante ou trop longue.";
  if (message.length < MESSAGE_MIN || message.length > MESSAGE_MAX)
    return "Message trop court ou trop long.";

  if (contact.includes("@")) {
    if (!EMAIL.test(contact)) return "Adresse e-mail invalide.";
    return { name, contact, contactType: "email", message };
  }
  const phone = normalizePhone(contact);
  if (!phone) return "Numéro de téléphone invalide.";
  return { name, contact: phone, contactType: "phone", message };
}

/* Garde-fou mémoire, en complément du rate limit Traefik (50 req/min/IP) :
   celui-ci couvre tout le site, celui-là ne protège que l'envoi de messages,
   qui est le seul point coûteux. Une Map suffit — un seul conteneur, et un
   redémarrage qui remet le compteur à zéro n'a aucune conséquence. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) return true;
  recent.push(now);
  hits.set(ip, recent);
  /* Purge opportuniste : sans elle la Map croît indéfiniment sur un process
     qui tourne des semaines. */
  if (hits.size > 500) {
    for (const [key, times] of hits) {
      if (times.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }
  return false;
}

export async function POST(request: NextRequest) {
  /* Derrière Cloudflare puis Traefik, l'IP du socket est celle du proxy.
     CF-Connecting-IP est le seul en-tête fiable ici — c'est déjà celui que
     le rate limit Traefik utilise (cf. docker-compose.yml). */
  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "inconnu";

  if (rateLimited(ip)) {
    return Response.json(
      { ok: false, error: "Trop de messages envoyés. Réessayez plus tard." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { ok: false, error: "Requête invalide." },
      { status: 400 },
    );
  }

  const result = validate(body);
  if (result === "bot") return Response.json({ ok: true });
  if (typeof result === "string") {
    return Response.json({ ok: false, error: result }, { status: 400 });
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    /* Sans destination, un 200 serait un mensonge : le visiteur croirait son
       message parti. On échoue franchement, et le formulaire renvoie vers le
       téléphone. */
    console.error("[contact] CONTACT_WEBHOOK_URL absent — message non relayé");
    return Response.json(
      { ok: false, error: "Service indisponible." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(webhook, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        /* En-tête explicite, pour deux raisons. D'abord l'appel est
           identifiable dans les journaux n8n. Ensuite et surtout : l'option
           « Ignore Bots » du nœud Webhook classe les agents inconnus comme
           robots et répond 403 « Authorization data is wrong! » — un message
           qui ne dit pas son vrai motif et qu'on a mis un moment à
           diagnostiquer. L'option est désactivée côté n8n, ceci est la
           ceinture en plus des bretelles. */
        "User-Agent": "doogaventure.fr (formulaire de contact)",
      },
      body: JSON.stringify({
        ...result,
        receivedAt: new Date().toISOString(),
        ip,
        userAgent: request.headers.get("user-agent") ?? "",
      }),
      /* n8n sur le même Pi répond en quelques ms. Au-delà de 10 s, c'est qu'il
         est tombé : mieux vaut le dire que laisser le visiteur sur un bouton
         qui tourne. */
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`n8n a répondu ${response.status}`);
  } catch (error) {
    console.error("[contact] relais n8n en échec :", error);
    return Response.json(
      { ok: false, error: "L’envoi a échoué." },
      { status: 502 },
    );
  }

  return Response.json({ ok: true });
}
