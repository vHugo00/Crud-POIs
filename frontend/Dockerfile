# Frontend Dockerfile
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build

# Stage 2: Production container
FROM node:18-alpine AS production

# Set working directory
WORKDIR /app

# Copy built files from the previous stage
COPY --from=build /app ./

# Expose the Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]
