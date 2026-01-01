# Use Node.js 20 Alpine for smaller image size
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install dependencies
RUN cd backend && npm ci
RUN npm ci

# Build backend
FROM base AS backend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/backend/node_modules ./backend/node_modules
COPY backend ./backend
COPY prisma ./backend/prisma

# Generate Prisma Client and build
RUN cd backend && npx prisma generate && npm run build

# Build frontend
FROM base AS frontend-builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5050

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

# Copy backend
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/dist ./backend/dist
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/package.json ./backend/package.json
COPY --from=backend-builder --chown=nodejs:nodejs /app/backend/prisma ./backend/prisma

# Copy frontend build
COPY --from=frontend-builder --chown=nodejs:nodejs /app/dist ./dist

# Copy start script
COPY backend/start.sh ./start.sh
RUN chmod +x ./start.sh

USER nodejs

EXPOSE 5050

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5050/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["./start.sh"]
