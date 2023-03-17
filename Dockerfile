FROM node:16.19.0-slim
WORKDIR /app/
COPY package.json .
COPY tsconfig.json .
RUN npm install
COPY src src
RUN npx tsc
CMD node dist/index.js
