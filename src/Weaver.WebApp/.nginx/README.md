# NGINX

## Logging 
Add the following line to nginx.conf file to enable debug level
```text
server {
    ...
    error_log                   /dev/stderr debug;
    ...
}
```
Reference: https://www.digitalocean.com/community/tutorials/nginx-access-logs-error-logs

### Check status of the config file
`nginx -t`