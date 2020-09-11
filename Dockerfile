FROM node:current

# Install JDK
RUN curl -sSL -o java.tar.gz https://download.java.net/java/GA/jdk14.0.2/205943a0976c4ed48cb16f1043c5c647/12/GPL/openjdk-14.0.2_linux-x64_bin.tar.gz && \
    mkdir -p /opt/java && \
    tar xf java.tar.gz -C /opt/java && \
    ln -s /opt/java/bin/* /usr/bin/ && \
    rm java.tar.gz

# Show Java version
RUN java -version

# Install Elasticsearch
RUN apt-get install wget && \
    wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo apt-key add - && \
    apt-get install apt-transport-https && \
    echo "deb https://artifacts.elastic.co/packages/7.x/apt stable main" | sudo tee /etc/apt/sources.list.d/elastic-7.x.list && \
    apt-get update && \
    apt-get install elasticsearch && \
    apt-get autoremove

# Install npm dependencies
RUN npm i
