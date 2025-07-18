#! /bin/sh

if [ -z "$APP_ENV_PREFIX" ]; then
    echo "APP_ENV_PREFIX is not set. Exiting."
    exit 1
fi

for i in $(env | grep "^$APP_ENV_PREFIX"); do
    key=$(echo "$i" | cut -d '=' -f 1)
    value=$(echo "$i" | cut -d '=' -f 2-)

    echo "$key=$value"

    find "/usr/share/nginx/html/dpbdt" -type f -exec sed -i 's|'"${key}"'|'"${value}"'|g' {} \;
    find "/tmpl/dist/dpbdt/" -type f -exec sed -i 's|'"${key}"'|'"${value}"'|g' {} \;  
done

# Start nginx
nginx -g "daemon off;"