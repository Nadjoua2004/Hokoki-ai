# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package files first and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Optional environment variable
ENV NODE_ENV=production

# Start the server
CMD ["node", "server.js"]
