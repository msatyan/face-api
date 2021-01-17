FROM node:14

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard to include package-lock.json as well
# COPY package*.json /usr/src/app
COPY package*.json /usr/src/app/

# RUN npm install -g ts-node
RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY ./dist /usr/src/app/dist
COPY ./model /usr/src/app/model
COPY ./example /usr/src/app/example

EXPOSE 8080
# CMD [ "ts-node", "src/rest-faceCompare.ts" ]
CMD [ "node", "example/node-wss-SingleFace.js" ]

