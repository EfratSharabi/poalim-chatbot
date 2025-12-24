# =========================
# Stage 1: Build Angular App
# =========================
FROM node:24 AS angular-build

WORKDIR /app

# Copy root-level files
COPY package.json package-lock.json nx.json tsconfig.base.json ./

# Install all dependencies (needed for NX CLI)
RUN npm install

# Copy Angular source and shared libs
COPY apps/web ./apps/web
COPY libs ./libs

# Build Angular app using NX production configuration
RUN npx nx build web --configuration=production
# Output: dist/apps/web

# =========================
# Stage 2: Build Nest App
# =========================
FROM node:24 AS nest-build

WORKDIR /app

# Copy root files and install all dependencies (NX CLI is needed)
COPY package.json package-lock.json nx.json tsconfig.base.json ./
RUN npm install

# Copy Nest source code and shared libs
COPY apps/api ./apps/api
COPY libs ./libs

# Copy Angular build into Nest public folder
COPY --from=angular-build /app/dist/apps/web/browser ./dist/public

# Build Nest app using NX production configuration
RUN npx nx build api --configuration=production
# Output: dist/apps/api

# =========================
# Stage 3: Runtime Image
# =========================
FROM node:24-alpine AS runtime

WORKDIR /app

# Copy built Nest app
COPY --from=nest-build /app/dist/apps/api ./dist

# Copy package files and install production dependencies only
COPY package.json package-lock.json ./
RUN npm install --production

# Expose Nest server port
EXPOSE 3333

# Start Nest server
CMD ["node", "dist/main.js"]
