# ---------- build stage ----------
ARG NODE_VERSION=22
FROM node:${NODE_VERSION} AS builder

# ensure npm is recent enough (optional but prevents npm/node mismatch warnings)
RUN npm install -g npm@latest

WORKDIR /app
COPY package*.json ./
# use npm ci in CI for reproducible installs
RUN npm ci --production=false

COPY . .
# build step (if you have one)
RUN npm run build || echo "no build step"

# ---------- runtime stage ----------
FROM node:${NODE_VERSION}-slim AS runner

# Keep npm updated in runtime as well (optional)
RUN npm install -g npm@latest

WORKDIR /app
# copy only needed files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public
COPY --from=builder /app ./

# drop to a non-root user (best practice)
RUN useradd --uid 1000 --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000
CMD ["npx", "next", "start"]
