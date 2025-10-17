# Dockerfile
# ---- builder ----
FROM node:18.20-alpine AS builder
WORKDIR /app

# install dependencies early for cache
COPY package*.json ./
RUN npm ci

# copy source
COPY . .

# Accept build-time args for public NEXT_PUBLIC_ variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_GOOGLE_API_BASE_URL
ARG NEXT_PUBLIC_USER_SERVICE_URL
ARG NEXT_PUBLIC_AI_SERVICE_URL

# Expose them as env variables inside the build container so Next.js can read them during `next build`
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY:-}
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-}
ENV NEXT_PUBLIC_GOOGLE_API_BASE_URL=${NEXT_PUBLIC_GOOGLE_API_BASE_URL:-}
ENV NEXT_PUBLIC_USER_SERVICE_URL=${NEXT_PUBLIC_USER_SERVICE_URL:-}
ENV NEXT_PUBLIC_AI_SERVICE_URL=${NEXT_PUBLIC_AI_SERVICE_URL:-}

# Build the Next.js app (turbopack or webpack per your package.json)
RUN npm run build

# ---- runner ----
FROM node:18.20-alpine AS runner
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy necessary runtime assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Start the app (adjust script if different)
CMD ["npm", "run", "start"]
