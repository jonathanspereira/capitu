# Etapa 1: Build da aplicação
FROM node:22-bookworm-slim AS build

WORKDIR /app

COPY package*.json ./

RUN npm ci --ignore-scripts && npx prisma generate

COPY src ./src
COPY tsconfig.json ./
COPY prisma ./prisma

RUN npm run build

# Etapa 2: Imagem final para produção
FROM node:22-bookworm-slim

WORKDIR /app

RUN useradd -m appuser
USER appuser

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

RUN [ -n "$DIRECT_URL" ] && npx prisma generate || echo "Skipping Prisma generate, DIRECT_URL not set"

CMD ["node", "dist/index.js"]
