# ---- builder ----
FROM node:18.20-alpine AS builder
WORKDIR /app

# copy package and lockfiles first for caching
COPY package*.json ./

# install all deps (dev + prod) for build
RUN npm ci

# copy source and build
COPY . .

# accept build-time arg for Clerk publishable key (optional)
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}

# build the Next.js app
RUN npm run build

# ---- runner ----
FROM node:18.20-alpine AS runner
WORKDIR /app

# copy only production deps to runner
COPY package*.json ./
RUN npm ci --omit=dev

# copy built output and static assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Adjust this start script if your package.json uses a different command (e.g. "start" runs next start).
CMD ["npm", "run", "start"]
