# Use an official Node.js runtime as a parent image, using Alpine for a smaller footprint
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install the application dependencies cleanly
RUN npm ci

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on (defaults to 5000)
EXPOSE 5000

# Define the command to run the application
CMD ["npm", "start"]
