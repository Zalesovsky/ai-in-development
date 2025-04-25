FROM nginx:alpine
COPY src/frontend/index.html /usr/share/nginx/html/
COPY src/frontend/script.js /usr/share/nginx/html/
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
