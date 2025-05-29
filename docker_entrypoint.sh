#!/bin/sh

# Extract the alias value from config.main
alias_value=$(awk -F'=' '/^alias=/ {print $2}' ~/config.main)
# awk -F'=' '/^alias=/ {print $2}' ~/config.main
# Run generate-html.py with the alias value as an argument
echo "running utxoracle.py -$alias_value"
python3 /app/utxoracle.py "-$alias_value"

# # Verify the move was successful
# if [ ! -f "/app/index.html" ]; then
#   echo "Error: Failed to move index.html to /app/index.html" >&2
#   exit 1
# fi


# Start the webserver Rust service
printf "\n\n [i] Starting Webserver ...\n\n"
exec tini /usr/local/bin/webserver
