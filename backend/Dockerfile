# ====================================
# MULTI-STAGE DOCKERFILE
# ====================================

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies first (for better caching)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# ====================================
# Stage 2: Development stage (NEW)
# ====================================
FROM node:20-alpine AS development

WORKDIR /app

# Install bash and tools for development
RUN apk add --no-cache bash dumb-init

# Copy package.json first and install ALL dependencies (including dev)
COPY package*.json ./
RUN npm install

# Copy entire source code (hot reload)
COPY . .

# Expose backend port
EXPOSE 3000

# Run NestJS in dev mode
CMD ["npm", "run", "start:dev"]

# ====================================
# Stage 3: Production stage
# ====================================
FROM node:alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001

# Copy package.json and install production dependencies
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules

# Create uploads directory
RUN mkdir -p uploads logs && chown -R nestjs:nodejs uploads logs

USER nestjs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node dist/health-check.js

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
