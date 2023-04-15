From node:latest
WORKDIR /opt/dayi/
COPY ./projects/0.11/ /opt/dayi/
RUN npm install
CMD ['node','index.js']