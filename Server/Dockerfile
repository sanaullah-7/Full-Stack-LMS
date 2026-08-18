FROM node:20-alpine

WORKDIR /app

# Copy dependency files (fixed case-sensitivity bug: package.json instead of Package.json)
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

USER node

CMD [ "node", "server.js" ]

