# Use an official Node runtime as a parent image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source inside Docker image
COPY . .

# Build your app
RUN npm run build

# Expose the port your app runs on
EXPOSE 3000

# Command to run your app
CMD [ "npm", "run", "serve" ]
