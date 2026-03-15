FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Compile contracts
RUN npx hardhat compile

# Startup script: launch node + deploy contract
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8545

ENTRYPOINT ["/docker-entrypoint.sh"]
