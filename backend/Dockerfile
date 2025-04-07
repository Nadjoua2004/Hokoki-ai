# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .

# Install any needed dependencies
RUN npm install

# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable (optional)
ENV NODE_ENV=production

# Run server.js when the container launches
CMD ["node", "server.js"]
