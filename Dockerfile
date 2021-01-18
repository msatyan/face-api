FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard to include package-lock.json as well
COPY package*.json /usr/src/app/

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./dist /usr/src/app/dist
COPY ./model /usr/src/app/model
COPY ./demo1 /usr/src/app/demo1

EXPOSE 8080
CMD [ "node", "demo1/node-wss-SingleFace.js" ]

