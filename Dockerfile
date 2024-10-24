# Use an official Node.js image as the base image
FROM node:14

# Create and set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application files to the container
COPY . .

# Expose the port on which the Node.js app will run
EXPOSE 3000

# Command to run the application
CMD ["node", "index.js"]
