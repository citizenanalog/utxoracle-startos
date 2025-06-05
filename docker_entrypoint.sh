#!/bin/sh

#Extract the argument value from config.main
argument_value=$(awk -F'=' '/^argument=/ {print $2}' ~/config.main)
# add '-' to input arg
dash_arg_value="-${argument_value}"
echo "dash_arg_value=$dash_arg_value"
# Check if argument_value starts with start9
case "$argument_value" in
    start9*)
        echo "running utxoracle.py without argument"
        python3 /app/utxoracle.py
        exit_code=$?
        echo $exit_code > /tmp/utxoracle_exit_code
        ;;
    *)
        echo "running utxoracle.py $dash_arg_value"
        python3 /app/utxoracle.py "$dash_arg_value"
        exit_code=$?
        echo $exit_code > /tmp/utxoracle_exit_code
        ;;
esac

# Start the webserver Rust service
printf "\n\n [i] Starting Webserver ...\n\n"
exec tini /usr/local/bin/webserver
