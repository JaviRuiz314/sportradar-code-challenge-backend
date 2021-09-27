FROM node:16.9-alpine

RUN mkdir -p /opt/app
WORKDIR /opt/app

ARG PORT
ENV PORT=4200

COPY . .
RUN npm install

EXPOSE 4200
CMD [ "npm", "start" ]