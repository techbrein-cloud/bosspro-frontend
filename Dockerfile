# ---- builder (Debian, full) ----
FROM node:18-bullseye AS builder
WORKDIR /app

# public build-time args (safe to embed in client bundle)
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY

ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL} \
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}

# cache dependency layer
COPY package*.json ./
RUN npm ci --no-audit --prefer-offline

# copy source and build
COPY . .
RUN npm run build

# collect only what's needed for runtime
RUN mkdir -p /artifacts && \
    cp -a package*.json /artifacts/ && \
    cp -a .next /artifacts/ || true && \
    cp -a public /artifacts/ || true

# ---- runner (Alpine, small) ----
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

# copy only package.json/lock and built output from builder
COPY --from=builder /artifacts/package*.json ./
# Install production deps for Alpine (no dev deps, safe for runtime)
RUN npm ci --omit=dev --no-audit

# copy build output and public static files
COPY --from=builder /artifacts/.next ./.next
COPY --from=builder /artifacts/public ./public

# create non-root user and set ownership
RUN addgroup -S app && adduser -S -G app app && chown -R app:app /app
USER app

# start (ensure your package.json "start" script runs `next start` for production)
CMD ["npm", "start"]
