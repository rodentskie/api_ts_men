FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./

USER root

# install global package
RUN npm install -g prettier

RUN npm install --only-prod
COPY . .
EXPOSE 3002

RUN ["npm", "run", "build"]

CMD ["npm", "start"]