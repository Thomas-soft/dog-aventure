import { Fragment } from "react";
import { cn, frenchSpacing } from "@/lib/utils";

/** Rend le `**gras**` des textes du client — et rien d'autre. Ses textes en
 *  sont pleins, et ses mises en avant disent ce qu'il veut qu'on retienne :
 *  les garder sans écrire de HTML dans la config. Pas de Markdown complet, à
 *  dessein — un titre ou un lien n'ont rien à faire dans un paragraphe. */
export function RichText({
  text,
  strongClassName,
}: {
  text: string;
  /** Couleur du gras, qui dépend du fond (ex : `text-cream` sur `bg-ink`) */
  strongClassName?: string;
}) {
  const parts = frenchSpacing(text).split(/\*\*(.+?)\*\*/g);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <strong
            key={i}
            className={cn("font-bold text-ink", strongClassName)}
          >
            {part}
          </strong>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
