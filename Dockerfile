FROM 1352255400/nginx
COPY nginx.conf  /etc/nginx/conf.d
RUN rm -rf /etc/nginx/conf.d/default.conf
COPY dist/  /usr/share/nginx/html/
EXPOSE 80
