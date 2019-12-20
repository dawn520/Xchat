FROM node:12.13-alpine
MAINTAINER Xixi Zhou

ADD . /app/
WORKDIR /app
RUN npm install
EXPOSE 1780
CMD ["npm","run","s-dev"]
