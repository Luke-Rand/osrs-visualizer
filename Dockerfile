# --- Stage 1: Build Frontend Assets ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for Vite)
RUN npm ci

# Copy source files
COPY . .

# Build production bundle into /app/dist
RUN npm run build

# --- Stage 2: Production Container ---
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001
ENV OSRS_CHAR_DIR=/app/character-exporter

# Create storage directory for character exports
RUN mkdir -p /app/character-exporter

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy Express server files
COPY server ./server

# Copy compiled frontend from builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 3001

VOLUME ["/app/character-exporter"]

CMD ["node", "server/index.js"]
