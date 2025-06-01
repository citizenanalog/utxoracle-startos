#!/bin/bash

set -e

# Wait briefly to ensure utxoracle.py has time to write the exit code
sleep 5

check_complete() {
    DURATION=$(</dev/stdin)
    if [ "$DURATION" -le 6000 ]; then
        echo "{\"status\": \"failure\", \"info\": \"Startup period\", \"code\": 60}" >&2
        exit 60
    elif [ ! -f /tmp/utxoracle_exit_code ]; then
        echo "{\"status\": \"failure\", \"info\": \"UTXOracle exit code file not found\"}" >&2
        exit 1
    elif [ "$(cat /tmp/utxoracle_exit_code)" != "0" ]; then
        echo "{\"status\": \"failure\", \"info\": \"UTXOracle failed with exit code $(cat /tmp/utxoracle_exit_code)\"}" >&2
        exit 1
    else
        echo "{\"status\": \"success\"}"
        exit 0
    fi
}

case "$1" in
    complete)
        check_complete
        ;;
    *)
        echo "Usage: $0 [command]" >&2
        echo
        echo "Commands:"
        echo "         complete"
        exit 1
        ;;
esac
