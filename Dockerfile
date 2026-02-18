# ---------- deps ----------
FROM node:20-alpine AS deps
WORKDIR /app

# Copia manifests primero (cache)
COPY package.json package-lock.json* ./

# Instala deps (npm)
RUN npm ci


# ---------- build ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next
RUN npm run build


# ---------- runner ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000
ENV HOSTNAME=0.0.0.0

# Copia lo mínimo necesario para ejecutar
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json* ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Si usas next.config con outputFileTracing, esto ayuda:
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/.next/static ./.next/static

EXPOSE 5000

# Debe existir "start": "next start -p 5000" o "next start"
CMD ["npm", "run", "start"]
