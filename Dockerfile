FROM nginx:alpine

# Copy app files
COPY index.html /usr/share/nginx/html/index.html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Remove default nginx page
RUN rm -f /usr/share/nginx/html/50x.html

EXPOSE 80

LABEL maintainer="IPTV Player"
LABEL description="Free TV IPTV web player"

CMD ["nginx", "-g", "daemon off;"]
