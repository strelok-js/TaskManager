FROM node:20
WORKDIR /home/node/app
COPY package*.json ./
COPY --chown=node:node . .
RUN npm install
USER node
ENV PORT=5000
EXPOSE 5000
ENV JWT_SECRET=KraineSecretniiKey
ENV MONGODB_URI=mongodb://192.168.1.20:27017/testDB
CMD ["node", "index.js"]
