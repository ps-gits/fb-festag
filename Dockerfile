# I use Node 16, since Sitecore Headless v18 support it
FROM node:18.12.0

# Set the working directory to /app
WORKDIR /app

# Accepting parameters that will be assigned as env. variables
# ARG PUBLIC_URL
# ARG SITECORE_API_KEY
# ARG SITECORE_API_HOST
# ARG FETCH_WITH

# Copy parameter values to env. variables
# ENV PUBLIC_URL=$PUBLIC_URL
# ENV SITECORE_API_KEY=$SITECORE_API_KEY
# ENV SITECORE_API_HOST=$SITECORE_API_HOST
# ENV FETCH_WITH=$FETCH_WITH


# Copy package.json and package-lock.json to /app
COPY package*.json ./


# Install dependencies
RUN npm install --force


# Copy the rest of the application code to /app
COPY . .


# Build the application
#RUN npm start:connected


# Expose port 3000 for the application (OOTB port in Next.js app)
#EXPOSE 3000


# Start the application
# Note: if you have another production startup command
# defined in package.json - use you one
CMD ["npm", "start:connected"]
