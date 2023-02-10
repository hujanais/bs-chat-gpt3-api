chat-gp3 api based on the transitive-bullshit project

### Develop using docker

### I am using my raspberry pi because my old Mac cannot run node 18.

```
docker pull node:18-bullseye-slim

# to run application in interactive mode to debug and poke around
cd bs-chat-gpt3-api folder
docker run -it -v $(pwd):/app node:18-bullseye-slim bash

# to run application in detached/normal mode.
cd bs-chat-gpt3-api folder
docker run -d -p 3000:3000 -v $(pwd):/app node:18-bullseye-slim

# helpful tips
docker stop [containerId] # to stop the containiner
docker start [containerId] # to restart the container
docker exec -it [containerId] bash # run in interactive mode
docker exec -d [containerId] # run in detached mode
docker logs --follow [containerId] # live tail the log file
```

### Packaging application with docker for cloud deployment on Heroku
