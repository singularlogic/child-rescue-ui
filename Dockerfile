FROM node:10.12.0 as bs
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:10.12.0
RUN npm install -g serve
WORKDIR /www
COPY --from=bs /app/dist/. ./
EXPOSE 8080
CMD [ "serve", "-l", "8080", "-s", "." ]
