FROM ops-harbor.staryuntech.com/sre/node:16.16.0-private AS builder

ARG ENV_ARG

WORKDIR /opt/build/

COPY . /opt/build/

RUN npm config set cache /tmp/cache \
    && npm ci --legacy-peer-deps --loglevel verbose \
    && export NODE_OPTIONS="--max-old-space-size=8192" \
    && npm run build:${ENV_ARG} --verbose 


FROM ops-harbor.staryuntech.com/sre/nginx:1.25-20230725

COPY nginx.conf  /etc/nginx/conf.d

COPY --from=builder /opt/build/dist  /usr/share/nginx/html/
