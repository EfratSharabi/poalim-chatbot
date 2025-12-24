# =========================
# Stage 1: Build Angular App
# =========================
FROM node:24 AS angular-build

# Set working directory
WORKDIR /app

# Copy root-level package files and NX config
COPY package.json package-lock.json nx.json ./
COPY tsconfig.base.json ./

# Install dependencies
RUN npm install

# Copy Angular source code and shared libraries
COPY apps/web ./apps/web
COPY libs ./libs

# Build Angular app using NX production configuration
RUN npx nx build web --configuration=production
# The output will be in dist/apps/web

# =========================
# Stage 2: Build Nest App
# =========================
FROM node:24 AS nest-build

WORKDIR /app

# Copy root-level package files and install production dependencies
COPY package.json package-lock.json nx.json ./
RUN npm install --production

# Copy Nest source code and shared libraries
COPY apps/api ./apps/api
COPY libs ./libs

# Copy Angular build from previous stage into Nest public folder
# This allows Nest to serve the Angular frontend
COPY --from=angular-build /app/dist/apps/web ./apps/api/public

# Build Nest app using NX production configuration
RUN npx nx build api --configuration=production
# The output will be in dist/apps/api

# =========================
# Stage 3: Runtime Image
# =========================
FROM node:24-alpine AS runtime

WORKDIR /app

# Copy built Nest app from previous stage
COPY --from=nest-build /app/dist/apps/api ./dist

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm install --production

# Expose port for Nest server
EXPOSE 3333

# Start Nest server
CMD ["node", "dist/main.js"]