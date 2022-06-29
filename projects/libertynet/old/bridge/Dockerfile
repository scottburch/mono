FROM node:18

EXPOSE 3000/tcp


RUN apt-get update -y

RUN npm install --global lerna

COPY . app
WORKDIR /app/bridge

RUN lerna bootstrap


ENTRYPOINT yarn start-bridge