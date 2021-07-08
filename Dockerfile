FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./

USER root

# install global package
RUN npm install -g prettier typescript

RUN npm install --only-prod

COPY . ./

RUN ["npm", "run", "build"]

CMD ["npm", "start"]

EXPOSE 3002