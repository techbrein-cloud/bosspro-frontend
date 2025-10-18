# Robust multi-stage Dockerfile that collects whatever build output exists
ARG NODE_VERSION=22
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# ensure npm is recent enough (optional)
RUN npm install -g npm@latest

# copy package manifests first for better caching
COPY package*.json ./

# install dev deps so build can run (uses package-lock if present)
RUN npm ci

# copy source
COPY . .

# run build (let it fail loudly — don't swallow errors)
RUN npm run build

# collect build artifacts into /artifacts in a tolerant way
RUN set -eux; \
    mkdir -p /artifacts; \
    # possible build outputs: .next (Next.js), dist (ts/node), build, out (next export), public
    if [ -d ".next" ]; then cp -a .next /artifacts/.next; fi; \
    if [ -d "dist" ]; then cp -a dist /artifacts/dist; fi; \
    if [ -d "build" ]; then cp -a build /artifacts/build; fi; \
    if [ -d "out" ]; then cp -a out /artifacts/out; fi; \
    if [ -d "public" ]; then cp -a public /artifacts/public; fi; \
    # copy next.config.js and any runtime files the app might need
    for f in next.config.js server.js ecosystem.config.js; do [ -f "$f" ] && cp -a "$f" /artifacts/ || true; done; \
    # copy package manifests so runtime can install production deps
    cp -a package*.json /artifacts/ || true; \
    # list artifacts for debugging/verification
    echo "Artifacts created:"; ls -la /artifacts || true

# Runtime stage
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# copy package manifest and install only production deps
COPY --from=builder /artifacts/package*.json ./
RUN npm ci --production

# copy collected build artifacts
COPY --from=builder /artifacts /app

# (optional) copy any runtime server file if present in artifacts
# e.g., server.js or ecosystem.config.js already copied into /app by previous COPY

# non-root user
RUN useradd --uid 1000 --shell /bin/bash appuser && chown -R appuser:appuser /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

# Determine start command: prefer common defaults but change if needed
# If Next.js built (.next), use next start; if dist exists, run node dist/server.js; fallback to npm start
CMD [ "sh", "-c", "if [ -d .next ]; then npx next start; elif [ -d dist ]; then node dist/server.js; elif [ -f server.js ]; then node server.js; else npm run start; fi" ]
