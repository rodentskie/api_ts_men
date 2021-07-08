FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./

USER root

# install global package
RUN npm install -g prettier typescript

RUN npm install --only-prod

RUN ["npm", "run", "build"]

COPY . .
EXPOSE 3002

CMD ["npm", "start"]