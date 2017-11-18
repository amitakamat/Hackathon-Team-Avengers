FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json .
COPY start.sh .
COPY begin.sh .

# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./

RUN npm install
RUN ./start.sh


# Bundle app source
COPY . .

EXPOSE 8082
EXPOSE 6379
CMD ./begin.sh
