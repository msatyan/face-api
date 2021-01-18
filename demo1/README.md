

### Setup
```bash
cd face-api
npm install
```

### run
```bash
# simple test

# bring up WSS server
node demo1/node-wss-SingleFace.js

# WSC client connect to the WSS server
node demo1/node-wsc-test1.js

# Command-line Argument to specify an image.
node demo1/node-wsc-test1.js ./demo1/img/modi2.jpg
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
# run the docker by assigning a container name = fcai-cnt1
docker run -it -d --name fcai-cnt1 -p 8080:8080 -d wss-fcai
```

### Basic test
```bash
node demo1/node-wsc-test1.js
```

### stop/start container
```bash
docker stop fcai-cnt1
docker start fcai-cnt1
```


### Getting in to the running container
```bash
docker ps -a
# runs a new command in a running container.
docker exec -it fcai-cnt1 /bin/bash
```

### delete the container
```bash
docker container rm fcai-cnt1
# fcai-cnt1

docker ps -a
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES
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


### Cleanup
```bash
# incase if you have to clean the existing images
docker system prune
docker system prune -a

# logout from container registry
docker logout
```



### Firewall
```bash
# by any chance if you have to shutdown the firewall then.
sudo systemctl stop firewalld.service

# Then to bring it up
sudo systemctl start firewalld.service
```

