# --------------------------
# Etapa 1: Build da aplicação
# --------------------------
FROM node:22-bookworm-slim AS build

RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build -- --project tsconfig.json

# --------------------------
# Etapa 2: Imagem de produção
# --------------------------
FROM node:22-bookworm-slim AS production

WORKDIR /app

COPY --from=build /app/package*.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
