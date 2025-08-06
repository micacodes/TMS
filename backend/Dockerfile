#Build
FROM node:18-alpine AS builder
WORKDIR /usr/src/app


RUN npm install -g bun


COPY package.json bun.lockb* ./
RUN bun install --frozen-lockfile

COPY . .

# Production
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/src ./src
COPY --from=builder /usr/src/app/package.json ./package.json
EXPOSE 3001
CMD [ "node", "src/server.js" ]