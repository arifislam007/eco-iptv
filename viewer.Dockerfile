FROM node:20-alpine
WORKDIR /app
COPY viewer-package.json package.json
RUN npm install --omit=dev
COPY viewer-server.js server.js
EXPOSE 8081
CMD ["node", "server.js"]
