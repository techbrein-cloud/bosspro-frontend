# Dockerfile
# --- builder (full Debian) ---
FROM node:18-bullseye AS builder
WORKDIR /app

# ONLY public build-time args (safe to embed in client bundle)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# DO NOT add CLERK_SECRET_KEY here - it's runtime-only

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

# cache dependencies layer
COPY package*.json ./
RUN npm ci --no-audit --prefer-offline

# copy source and build
COPY . .
RUN npm run build

# remove dev deps
RUN npm prune --production

# --- runtime (small) ---
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

# copy artifacts from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

# non-root user
RUN addgroup -S app && adduser -S -G app app \
    && chown -R app:app /app
USER app

CMD ["npm", "start"]
