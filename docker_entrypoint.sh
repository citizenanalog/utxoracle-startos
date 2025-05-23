#!/bin/sh

# Run generate-html.py to generate the HTML output file
python3 /app/generate-html.py
EXIT_STATUS=$?  # Capture exit status immediately

# Check if the script ran successfully
if [ $EXIT_STATUS -ne 0 ]; then
  echo "Error running generate-html.py (Exit status: $EXIT_STATUS)" >&2
  exit 1
fi

# Confirm successful execution
echo "generate-html.py ran successfully"

# Verify the move was successful
if [ ! -f "/app/index.html" ]; then
  echo "Error: Failed to move index.html to /app/index.html" >&2
  exit 1
fi

# Start the webserver Rust service
printf "\n\n [i] Starting Webserver ...\n\n"
exec tini /usr/local/bin/webserver
