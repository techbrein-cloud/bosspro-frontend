# ---- builder ----
FROM node:18.20-alpine AS builder
WORKDIR /app

# copy package and lockfiles first for caching
COPY package*.json ./

# install all deps (dev + prod) for build
RUN npm ci

# copy source and build
COPY . .

# If you need build-time envs (Clerk publishable key), accept them as build-arg
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}

RUN npm run build

# ---- runner ----
FROM node:18.20-alpine AS runner
WORKDIR /app

# install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# copy built output and static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "run", "start"]
