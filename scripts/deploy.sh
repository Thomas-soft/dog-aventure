#!/usr/bin/env bash
# Déploiement en production. S'exécute SUR le Pi, jamais sur le poste de dev.
#
#   ssh <pi> 'cd ~/server/dog-aventure && ./scripts/deploy.sh'
#
# Depuis le Mac, `npm run deploy` fait exactement ça. Les étapes vivent ici,
# dans le dépôt, pour qu'elles soient versionnées avec le site.

set -euo pipefail

BRANCH="${BRANCH:-main}"
URL="${URL:-https://doogaventure.fr}"
CONTAINER="${CONTAINER:-dog-aventure}"

cd "$(dirname "$0")/.."

echo "▸ Récupération de $BRANCH"
git fetch --quiet origin "$BRANCH"

BEFORE="$(git rev-parse HEAD)"
AFTER="$(git rev-parse "origin/$BRANCH")"

if [ "$BEFORE" = "$AFTER" ]; then
  echo "  déjà à jour ($(git log -1 --format=%s))"
  echo "  (rebuild quand même — passer SKIP_IF_UNCHANGED=1 pour sortir ici)"
  [ "${SKIP_IF_UNCHANGED:-0}" = "1" ] && exit 0
else
  git log --oneline "$BEFORE..$AFTER" | sed 's/^/  /'
fi

git reset --hard --quiet "origin/$BRANCH"

echo "▸ Reconstruction de l'image"
docker compose --profile traefik up -d --build

echo "▸ Attente du healthcheck"
for i in $(seq 1 60); do
  state="$(docker inspect -f '{{.State.Health.Status}}' "$CONTAINER" 2>/dev/null || echo absent)"
  case "$state" in
    healthy) echo "  conteneur healthy"; break ;;
    unhealthy) echo "  ✗ conteneur unhealthy — docker compose --profile traefik logs"; exit 1 ;;
  esac
  [ "$i" = 60 ] && { echo "  ✗ toujours '$state' après 60 s"; exit 1; }
  sleep 1
done

echo "▸ Vérification publique"
# Le healthcheck vert ne dit qu'une chose : Next.js répond DANS le conteneur.
# Traefik, lui, redécouvre le conteneur recréé via l'API Docker, et il existe
# un battement de quelques secondes où plus aucun routeur ne correspond : le
# proxy répond alors 404. Vérifier une seule fois faisait échouer le script
# sur un déploiement pourtant réussi (constaté le 2026-08-11) — on réessaie.
# `|| true` : sinon `set -e` tue le script sur un curl en échec, avant même
# d'avoir pu afficher le code.
for i in $(seq 1 20); do
  code="$(curl -s -o /dev/null -m 20 -w '%{http_code}' "$URL/" || true)"
  [ "$code" = "200" ] && break
  [ "$i" = 20 ] && break
  sleep 3
done
if [ "$code" = "200" ]; then
  echo "  $URL → 200 (après ${i} tentative(s))"
else
  echo "  ✗ $URL → $code, toujours pas 200 après 60 s"
  echo "    le conteneur est healthy : regarder le routage Traefik, pas le site"
  echo "    docker network inspect \"\${TRAEFIK_NETWORK:-n8n-network}\" | grep -A3 dog-aventure"
  exit 1
fi

# Les anciennes couches s'accumulent vite sur une carte SD
echo "▸ Nettoyage des images orphelines"
docker image prune -f | tail -1 | sed 's/^/  /'

echo "✓ Déployé — $(git log -1 --format='%h %s')"
