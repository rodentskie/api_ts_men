FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./

USER root

RUN npm install --only-prod
COPY . .
EXPOSE 3002

RUN ["chmod", "+x", "start.sh"]

CMD ["./start.sh"]