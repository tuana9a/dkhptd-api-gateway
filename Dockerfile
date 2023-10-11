FROM node:16.19-slim
WORKDIR /app/
COPY package.json .
COPY tsconfig.json .
RUN npm install
COPY src src
RUN npx tsc
RUN date +"%Y.%m.%d.%H%M%S" > version.tmp.txt
CMD ["node", "dist/index.js"]
