

### Setup
```bash
cd face-api
npm install
```

### run
```bash
# simple test

# bring up WSS server
node example/node-wss-SingleFace.js

# WSC client connect to the WSS server
node example/node-wsc-test1.js

# Command-line Argument to specify an image.
node example/node-wsc-test1.js ./example/test1/modi2.jpg
```


### Sample Docker Build & Test
```bash
# to cleanup then only
docker system prune
docker system prune -a


docker build -t wss-fcai .
# delete an image
# docker rmi wss-fcai <image id>

docker images
# maped local-port:container-port
# docker run  -it wss-fcai /bin/bash
docker run -it -p 8080:8080 -d wss-fcai

# Basic test
node example/node-wsc-test1.js


#### to stop
# get the ps
docker ps | grep wss-fcai
# d0d7b996862d

# eg:
docker stop  d0d7b996862d
```

### Create a new docker image from the container and push to docker hub
```bash
docker login
docker logout


docker ps | grep wss-fcai
# d0d7b996862d

# docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
docker commit d0d7b996862d  xuser1/wss-fcai

# to push the image to docker hub
# docker push [OPTIONS] NAME[:TAG]
docker push xuser1/wss-fcai

```

### Pull the docker image from the docker hub and run
```bash
docker pull xuser1/wss-fcai
docker run -it -p 8080:8080 -d xuser1/wss-fcai
# https://cloud.docker.com/repository/docker/xuser1/wss-fcai
```


### Firewall
```bash
# by any chance if you have to shutdown the firewall then.
sudo systemctl stop firewalld.service

# Then to bring it up
sudo systemctl start firewalld.service
```

