FROM node:20.18.0-alpine

# Set the working directory to /app
WORKDIR /wms-gateway-service

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose port 4002 for the application to run on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]