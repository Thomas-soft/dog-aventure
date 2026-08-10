# syntax=docker/dockerfile:1

# Deux cibles dans un seul fichier :
#   --target dev    → next dev, sources montées en volume (docker compose, profil dev)
#   --target runner → image de prod minimale bâtie sur .next/standalone
#
# Node 22 : même version que le workflow GitHub Pages, et Alpine (musl) évite le
# problème d'allocateur mémoire de sharp sur les Linux glibc signalé par la doc
# Next (« Image Optimization may require additional configuration »).
ARG NODE_VERSION=22-alpine

# ───────────────────────── base ─────────────────────────
FROM node:${NODE_VERSION} AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ───────────────────────── deps ─────────────────────────
# Étage séparé : tant que package.json et le lock ne bougent pas, Docker
# réutilise le cache et ne réinstalle rien.
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ────────────────────────── dev ─────────────────────────
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# next dev écoute déjà 0.0.0.0 par défaut ; le port vient de package.json
EXPOSE 3777
CMD ["npm", "run", "dev"]

# ──────────────────────── builder ───────────────────────
FROM base AS builder
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# GITHUB_PAGES non défini ici : on veut la sortie standalone, pas l'export
RUN npm run build

# ──────────────────────── runner ────────────────────────
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

# server.js et les node_modules réduits que Next a tracés
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# `standalone` n'embarque volontairement ni public/ ni .next/static : à copier
# à la main, sinon le serveur répond 404 sur les assets et les images
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# wget vient de busybox, pas besoin de l'installer
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD wget -q --spider http://127.0.0.1:3000/ || exit 1

CMD ["node", "server.js"]
