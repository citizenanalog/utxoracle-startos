#!/bin/sh

#Extract the argument value from config.main
argument_value=$(awk -F'=' '/^argument=/ {print $2}' ~/config.main)

# Check if argument_value starts with start9
case "$argument_value" in
    start9*)
        echo "running utxoracle.py without argument"
        python3 /app/utxoracle.py
        ;;
    *)
        echo "running utxoracle.py -$argument_value"
        python3 /app/utxoracle.py "-$argument_value"
        ;;
esac

# Start the webserver Rust service
printf "\n\n [i] Starting Webserver ...\n\n"
exec tini /usr/local/bin/webserver
