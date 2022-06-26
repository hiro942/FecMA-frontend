FROM node
WORKDIR /friday_web/
COPY . .
RUN yarn && yarn build

FROM nginx
RUN rm /etc/nginx/conf.d/default.conf
ADD deploy/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist /usr/share/nginx/html
RUN chmod -R 755 /usr/share/nginx/html