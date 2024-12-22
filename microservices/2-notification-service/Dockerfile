# Stage 1
FROM node:22-alpine3.20 AS builder

WORKDIR /app
COPY package*.json ./
COPY tsconfig.json ./
COPY .npmrc ./
COPY src ./src
COPY tools ./tools

RUN npm install
RUN npm ci && npm run build

# Stage 2
FROM node:22-alpine3.20

WORKDIR /app
RUN apk add --no-cache curl
COPY package*.json ./
COPY .npmrc ./
RUN npm install -g pm2
RUN npm ci --production
COPY --from=builder /app/build ./build

EXPOSE 4001

CMD [ "npm","run", "start" ]
