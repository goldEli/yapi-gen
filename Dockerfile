FROM ops-harbor.staryuntech.com/sre/node:16.16.0-private AS builder

ARG ENV_ARG

WORKDIR /opt/build/

COPY . /opt/build/

RUN npm config set cache /tmp/cache \
    && npm set registry https://registry.npmmirror.com \
    && npm ci --legacy-peer-deps --loglevel verbose \
    && export NODE_OPTIONS="--max-old-space-size=8192" \
    && if [ "$ENV_ARG" = "development-b" ]; then \
             mv -f environments/.env.development-b environments/.env.development; \
           elif [ "$ENV_ARG" = "test-b" ]; then \
             mv -f environments/.env.test-b environments/.env.test; \
           fi \
    && npm run build:${ENV_ARG} --verbose 


FROM ops-harbor.staryuntech.com/sre/nginx:1.25-20230725

COPY nginx.conf  /etc/nginx/conf.d

COPY --from=builder /opt/build/dist  /usr/share/nginx/html/
