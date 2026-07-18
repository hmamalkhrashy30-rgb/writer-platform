FROM golang:1.21-alpine AS builder

WORKDIR /app
RUN apk add --no-cache make git sqlite

RUN git clone https://github.com/writefreely/writefreely.git . && \
    make build

FROM alpine:latest
RUN apk add --no-cache ca-certificates sqlite
WORKDIR /app

COPY --from=builder /app/writefreely /app/
COPY --from=builder /app/config.ini.sample /app/config.ini
COPY entrypoint.sh /app/
RUN chmod +x /app/entrypoint.sh

EXPOSE 8080
ENTRYPOINT ["/app/entrypoint.sh"]
