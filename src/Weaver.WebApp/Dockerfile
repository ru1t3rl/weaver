FROM oven/bun:1 AS build-env

# Set environment variable
ARG APP_ENV_PREFIX 

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package.json bun.lock ./
COPY packages ./packages

# Install dependencies
RUN bun install --frozen-lockfile

# Copy the entire application code to the container
COPY . .

RUN bun run build

# Build runtime image
FROM nginx:latest

# Gettext enables the use of envsubst.
RUN apt-get -qq update && \
    apt-get -yq install gettext && \
    rm -rf /var/lib/apt/lists/* && \
    apt-get clean

# Set environment variables (again, because they're not preserved between stages)    
ARG APP_ENV_PREFIX

# Copy nginx configuration file
WORKDIR /etc/nginx/
COPY ./.nginx/${NGINX_CONFIG_FILE:-nginx.conf} nginx.conf

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

# Copy app built artifacts to serving folder
COPY --from=build-env /app/dist/weaver /usr/share/nginx/html/weaver

# Copy app build artifacts to template folder so docker-entrypoint.sh can use it to perform env var substitution
COPY --from=build-env /app/dist/weaver /tmpl/dist/weaver/

COPY docker-entrypoint.sh /
RUN chmod 500 /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]