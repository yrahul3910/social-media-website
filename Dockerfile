FROM node:current

SHELL ["/bin/bash", "-c"]

# Install JDK
RUN curl -sSL -o java.tar.gz https://download.java.net/java/GA/jdk14.0.2/205943a0976c4ed48cb16f1043c5c647/12/GPL/openjdk-14.0.2_linux-x64_bin.tar.gz && \
    mkdir -p /opt/java && \
    tar xf java.tar.gz -C /opt/java && \
    ln -s /opt/java/jdk-14.0.2/bin/* /usr/bin/ && \
    rm java.tar.gz

# Show Java version
RUN java -version

# Install Elasticsearch
RUN apt-get update && \
    apt-get install wget git && \
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | apt-key add - && \
    apt-get install apt-transport-https && \
    echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | tee /etc/apt/sources.list.d/elastic-7.x.list && \
    apt-get update && \
    apt-get install elasticsearch && \
    apt-get autoremove

# Install npm dependencies
RUN git clone https://github.com/yrahul3910/social-media-website.git
WORKDIR social-media-website
RUN npm i
RUN npm test
