FROM node:20-alpine
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm ci || npm install

# Copy the rest of the source code
COPY . .

# Expose port
EXPOSE 3000

# Run your app
CMD ["npm", "start"]
