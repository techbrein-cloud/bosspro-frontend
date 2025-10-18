# ---------- build stage ----------
ARG NODE_VERSION=22
FROM node:${NODE_VERSION} AS builder

WORKDIR /app

# keep npm current
RUN npm install -g npm@latest

# install dependencies
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# build (fail loudly if it fails)
RUN npm run build

# collect build artifacts
RUN set -eux; \
    mkdir -p /artifacts; \
    # copy common build outputs (Next.js, TS, etc.)
    for dir in .next dist build out public; do \
      if [ -d "$dir" ]; then cp -a "$dir" /artifacts/; fi; \
    done; \
    # copy configs and manifests
    for f in next.config.js server.js package*.json; do \
      [ -f "$f" ] && cp -a "$f" /artifacts/ || true; \
    done; \
    echo "Artifacts ready:"; ls -la /artifacts || true

# ---------- runtime stage ----------
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app

# install only production deps
COPY --from=builder /artifacts/package*.json ./
RUN npm ci --production

# copy built artifacts
COPY --from=builder /artifacts /app

# robust non-root user creation (works even if useradd not present)
RUN set -eux; \
    TARGET_UID=1000; TARGET_USER=appuser; TARGET_GROUP=appuser; \
    if id -u "$TARGET_USER" >/dev/null 2>&1; then \
      echo "User $TARGET_USER already exists"; \
    else \
      if command -v useradd >/dev/null 2>&1; then \
        useradd --uid "$TARGET_UID" --create-home --shell /bin/bash "$TARGET_USER" || true; \
      elif command -v adduser >/dev/null 2>&1; then \
        adduser --disabled-password --gecos "" --uid "$TARGET_UID" "$TARGET_USER" || true; \
      else \
        echo "$TARGET_USER:x:${TARGET_UID}:${TARGET_UID}:app user:/home/$TARGET_USER:/bin/bash" >> /etc/passwd || true; \
        mkdir -p /home/$TARGET_USER || true; \
      fi; \
    fi; \
    mkdir -p /app && chown -R "${TARGET_UID}:${TARGET_UID}" /app || true

USER appuser

ENV NODE_ENV=production
EXPOSE 3000

# auto-detect correct start command
CMD ["sh", "-c", "if [ -d .next ]; then npx next start; elif [ -d dist ]; then node dist/server.js; elif [ -f server.js ]; then node server.js; else npm run start; fi"]
