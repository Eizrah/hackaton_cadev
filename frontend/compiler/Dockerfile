FROM node:24-bookworm-slim
RUN apt-get update \
    && apt-get install -y --no-install-recommends gcc g++ libc6-dev openjdk-17-jdk-headless python3 php-cli php-mbstring php-readline \
    && rm -rf /var/lib/apt/lists/*
RUN npm install --global typescript@6.0.3 @types/node@24.19.2
COPY runner.py /opt/devafrica/runner.py
ENV LANG=C.UTF-8 HOME=/tmp
USER 65532:65532
ENTRYPOINT ["/usr/bin/python3", "-I", "/opt/devafrica/runner.py"]
