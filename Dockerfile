# Use the official node image as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including Expo CLI)
RUN npm install -g expo-cli && npm install

# Copy the rest of your project files into the container
COPY . .

# Expose the port for Metro bundler
EXPOSE 8081

# Run Expo inside the container
CMD ["expo", "start", "--tunnel"]
