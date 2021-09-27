FROM node:16.9-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

ARG PORT
ENV PORT=$PORT

COPY . .
RUN npm install

EXPOSE $PORT
CMD [ "npm" "run" "start" ]