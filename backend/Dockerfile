# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# Platform (Railway/Fly) injects PORT at runtime; this is just a local default.
ENV PORT=8080
# Bind to all interfaces so the container is reachable (required by Railway).
ENV HOSTNAME=0.0.0.0

# Copy the standalone server output produced by `output: "standalone"`.
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 8080
CMD ["node", "server.js"]
