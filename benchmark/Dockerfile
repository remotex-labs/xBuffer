FROM node:22-slim
LABEL authors="Garefild"

# Set the working directory inside the container
WORKDIR /app

# Copy files
COPY index.ts ./
COPY package*.json ./
COPY tsconfig.json ./

# RUN npm install
RUN npm install

# Step 8: Run the benchmark file (e.g., "benchmark.ts" or compiled "benchmark.js")
CMD ["npm", "start"]

