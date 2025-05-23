FROM python:3.9-slim

# Install tini to manage the process
RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy generate-html.py to /app
COPY generate-html.py /app/generate-html.py
RUN chmod +x /app/generate-html.py

# Copy utxoracle.py to /app
COPY utxoracle.py /app/utxoracle.py
RUN chmod +x /app/utxoracle.py

ARG ARCH
ADD ./webserver/target/${ARCH}-unknown-linux-musl/release/webserver /usr/local/bin/webserver
RUN chmod +x /usr/local/bin/webserver

ADD ./docker_entrypoint.sh /usr/local/bin/docker_entrypoint.sh
RUN chmod +x /usr/local/bin/docker_entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker_entrypoint.sh"]
