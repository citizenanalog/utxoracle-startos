FROM python:3.9-slim

# Install tini to manage the process
# Install dependencies including wget
RUN apt-get update && apt-get install -y wget tini && rm -rf /var/lib/apt/lists/*

# Install bitcoin-cli based on architecture
RUN ARCH=$(uname -m) && \
    if [ "$ARCH" = "aarch64" ]; then \
        wget https://bitcoin.org/bin/bitcoin-core-25.0/bitcoin-25.0-aarch64-linux-gnu.tar.gz && \
        tar -xvf bitcoin-25.0-aarch64-linux-gnu.tar.gz && \
        mv bitcoin-25.0/bin/bitcoin-cli /usr/local/bin/ && \
        rm -rf bitcoin-25.0-aarch64-linux-gnu.tar.gz bitcoin-25.0; \
    elif [ "$ARCH" = "x86_64" ]; then \
        wget https://bitcoin.org/bin/bitcoin-core-25.0/bitcoin-25.0-x86_64-linux-gnu.tar.gz && \
        tar -xvf bitcoin-25.0-x86_64-linux-gnu.tar.gz && \
        mv bitcoin-25.0/bin/bitcoin-cli /usr/local/bin/ && \
        rm -rf bitcoin-25.0-x86_64-linux-gnu.tar.gz bitcoin-25.0; \
    else \
        echo "Unsupported architecture: $ARCH"; \
        exit 1; \
    fi


WORKDIR /app

# Copy generate-html.py to /app
COPY generate-html.py /app/generate-html.py
RUN chmod +x /app/generate-html.py

#Copy utxoracle.py to /app
COPY utxoracle.py /app/utxoracle.py
RUN chmod +x /app/utxoracle.py

ARG ARCH
ADD ./webserver/target/${ARCH}-unknown-linux-musl/release/webserver /usr/local/bin/webserver
RUN chmod +x /usr/local/bin/webserver

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
ADD utils/*.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/*.sh
#RUN chmod +x /usr/local/bin/docker_entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
