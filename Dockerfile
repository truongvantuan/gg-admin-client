FROM nginx:1.21.6
COPY dist.tar.gz /usr/share/nginx
RUN cd /usr/share/nginx && ls && tar -zxvf dist.tar.gz && rm -rf html && mv dist html