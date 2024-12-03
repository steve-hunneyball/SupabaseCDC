FROM ubuntu:latest
WORKDIR /usr/src/app
COPY . .

RUN apt-get update \
    && apt-get install -y sudo

RUN useradd -m docker
RUN usermod -a -G sudo docker

RUN apt-get install npm -y
RUN npm install nats@latest
RUN npm install dotenv --save
RUN npm i -D tsx

USER docker
CMD bash

EXPOSE 4222

CMD npx tsx src/main.ts --env-file=../.env

LABEL authors="stevehunneyball"