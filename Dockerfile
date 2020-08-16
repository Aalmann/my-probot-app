FROM node:12-alpine

ENV TZ Europe/Berlin
RUN apk add --update --no-cache python3 make gcc tzdata \
    && cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone \
	&& apk del tzdata

#RUN apt-get install tzdata
#RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package*.json ./

COPY . .
RUN npm install
#RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]