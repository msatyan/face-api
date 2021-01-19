

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


### Docker Build & Test
```bash
# to cleanup then only
docker system prune
docker system prune -a


docker build -t wss-fapi2 .
# delete an image
# docker rmi wss-fapi2 <image id>

docker images
# maped local-port:container-port
# run the docker by assigning a container name = fapi2-cnt1
docker run -it -d --name fapi2-cnt1 -p 8080:8080 -d wss-fapi2
```

### Basic test
```bash
node demo1/node-wsc-test1.js
node demo1/node-wsc-test1.js ./demo1/img/modi2.jpg
```

### stop/start container
```bash
docker stop  fapi2-cnt1
docker start fapi2-cnt1
```


### Getting in to the running container
```bash
docker ps -a
# runs a new command in a running container.
docker exec -it fapi2-cnt1 /bin/bash
```

### DELETE: container/docker image
```bash
docker container rm fapi2-cnt1
# fapi2-cnt1

docker ps -a
# CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES

# To remove docker image
docker images
docker image rm <image id>
```


### Create a new docker image from the container and push to docker hub
```bash
# FYI: Your password will be stored unencrypted in ~/.docker/config.json
docker login
docker logout


docker ps | grep wss-fapi2
# d0d7b996862d

# docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
docker commit d0d7b996862d  xuser1/wss-fapi2

# to push the image to docker hub
# docker push [OPTIONS] NAME[:TAG]
docker push xuser1/wss-fapi2

```

### Pull the docker image from the docker hub and run
```bash
docker pull xuser1/wss-fapi2
docker run -it -p 8080:8080 -d xuser1/wss-fapi2
# https://cloud.docker.com/repository/docker/xuser1/wss-fapi2
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

