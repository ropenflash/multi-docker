FROM node as builder
WORKDIR  /app
COPY package.json .
RUN yarn install
COPY . .
RUN yarn build


FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY /nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build .
EXPOSE  3000
