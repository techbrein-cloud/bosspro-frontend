FROM node:16 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-audit --prefer-offline || npm install

# Copy source
COPY . .

# Build Next.js
RUN npm run build

FROM node:16-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
EXPOSE 3000

# Copy build and node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public

RUN addgroup -S next && adduser -S next -G next
USER next

CMD ["npm", "start"]
