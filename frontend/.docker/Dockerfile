# production stage
FROM nginx:1.27
COPY --from=builder /home/app/dist /usr/share/nginx/html
