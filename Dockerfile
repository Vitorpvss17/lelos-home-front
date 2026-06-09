# ── Stage 1: build ───────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS build
WORKDIR /app

# Dependências (cache de camada)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Código + build. VITE_API_URL é embutido no bundle do client em build-time,
# então precisa estar disponível como build arg (o Railway injeta as variáveis
# do serviço como build args automaticamente em builds por Dockerfile).
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN bun run build

# ── Stage 2: runtime ─────────────────────────────────────────────────────
FROM oven/bun:1-alpine
WORKDIR /app
ENV NODE_ENV=production

# dist + node_modules (o handler SSR faz import dinâmico de @tanstack/react-start)
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/serve.js ./serve.js
COPY --from=build /app/package.json ./package.json

# A app escuta na variável PORT (Railway injeta); fallback 3000.
EXPOSE 3000
CMD ["bun", "serve.js"]
