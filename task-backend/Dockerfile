
# Use official Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose ports (5000 for Gateway, 5001 for Backend Service)
EXPOSE 5000 5001

# Default command (overridden in docker-compose)
CMD ["npm", "run", "dev"]
