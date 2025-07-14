FROM oven/bun:1 AS deps
WORKDIR /usr/src/app

COPY package.json bun.lock ./
COPY packages ./packages
RUN bun install --frozen-lockfile

FROM deps AS builder
WORKDIR /usr/src/app
COPY . .
ENV NODE_ENV=production
RUN bun run build

FROM nginx:stable-alpine AS release
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

# Copy the entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 80

# Use the custom entrypoint
ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]