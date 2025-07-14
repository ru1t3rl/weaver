#!/bin/sh

# Function to replace environment variables in JavaScript files
replace_env_vars() {
    echo "Replacing environment variables in built files..."
    
    # Find all JavaScript files in the dist directory
    find /usr/share/nginx/html -name "*.js" -type f | while read -r file; do
        echo "Processing file: $file"
        
        # Replace environment variables in the format import.meta.env.VITE_*
        # This handles the common Vite environment variable pattern
        for var in $(env | grep '^VITE_' | cut -d= -f1); do
            value=$(printenv "$var")
            # Escape special characters for sed
            escaped_value=$(printf '%s\n' "$value" | sed 's/[[\.*^$()+?{|]/\\&/g')
            
            # Replace the placeholder with the actual value
            sed -i "s|import\.meta\.env\.${var}|\"${escaped_value}\"|g" "$file"
        done
    done
    
    # Also handle any configuration files that might contain environment variables
    if [ -f /usr/share/nginx/html/config.js ]; then
        echo "Processing config.js..."
        for var in $(env | grep '^VITE_' | cut -d= -f1); do
            value=$(printenv "$var")
            escaped_value=$(printf '%s\n' "$value" | sed 's/[[\.*^$()+?{|]/\\&/g')
            sed -i "s|import\.meta\.env\.${var}|\"${escaped_value}\"|g" /usr/share/nginx/html/config.js
        done
    fi
}

# Function to generate nginx configuration if needed
generate_nginx_config() {
    if [ -n "$NGINX_ROOT" ]; then
        echo "Setting custom nginx root to: $NGINX_ROOT"
        sed -i "s|/usr/share/nginx/html|$NGINX_ROOT|g" /etc/nginx/conf.d/default.conf
    fi
    
    if [ -n "$NGINX_PORT" ]; then
        echo "Setting custom nginx port to: $NGINX_PORT"
        sed -i "s|listen 80|listen $NGINX_PORT|g" /etc/nginx/conf.d/default.conf
    fi
}

# Function to create a runtime config file
create_runtime_config() {
    echo "Creating runtime configuration..."
    
    # Create a JavaScript file with environment variables
    cat > /usr/share/nginx/html/runtime-config.js << EOF
window.runtimeConfig = {
$(env | grep '^VITE_' | while IFS='=' read -r key value; do
    echo "  $key: \"$value\","
done)
};
EOF
}

# Main execution
echo "Starting docker-entrypoint.sh..."

# Set default values for common environment variables if not provided
export VITE_API_URL="${VITE_API_URL:-http://localhost:5000}"
export VITE_APP_NAME="${VITE_APP_NAME:-Weaver}"
export VITE_APP_VERSION="${VITE_APP_VERSION:-1.0.0}"

# Show environment variables for debugging
echo "Environment variables starting with VITE_:"
env | grep '^VITE_' | sort

# Replace environment variables in built files
replace_env_vars

# Generate nginx configuration
generate_nginx_config

# Create runtime config file as an alternative approach
create_runtime_config

# Ensure proper permissions
chmod -R 755 /usr/share/nginx/html

echo "Environment variable replacement completed. Starting nginx..."

# Execute the original command (nginx)
exec "$@"