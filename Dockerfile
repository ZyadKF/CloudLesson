# === Stage compilation ===
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# === Stage exécution ===
FROM node:18-alpine AS runner

WORKDIR /app

# Copier uniquement ce qui est nécessaire depuis le build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER node

CMD ["node", "dist/index.js"]
