# =========================
# Stage 1: Build Angular
# =========================
FROM node:24 AS angular-build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./
COPY nx.json tsconfig.base.json ./
COPY angular.json ./
COPY apps/web ./apps/web
COPY libs ./libs

# Install dependencies
RUN npm install

# Build Angular app
RUN npx nx build web --prod

# =========================
# Stage 2: Build Nest
# =========================
FROM node:24 AS nest-build

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Copy Nest source code
COPY apps/api ./apps/api
COPY libs ./libs

# Copy Angular build from previous stage into Nest's public folder
COPY --from=angular-build /app/dist/apps/web ./apps/api/public

# Build Nest app (typescript)
RUN npm install -g nx
RUN npx nx build api --prod

# =========================
# Stage 3: Runtime
# =========================
FROM node:24-alpine AS runtime

WORKDIR /app

# Copy built Nest app
COPY --from=nest-build /app/dist/apps/api ./dist

# Install production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Expose port
EXPOSE 3333

# Start the Nest app
CMD ["node", "dist/main.js"]