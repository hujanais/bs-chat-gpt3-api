### Key technologies

Raspberry Pi, Docker, ngrok, NodeJS(typescript), Twilio, WhatsApp

### Objective

I wanted to find a way to allow my aging parents use WhatsApp too communicate with OpenAI's chat-gpt. My parents are not techically inclined at all and the only thing they really know how to use is WhatsApp on their mobile. Even an ipad was a stretch except for Facetime. So I figured why not give them this chance to actually interact with the NLP AI using WhatsApp.

So this 2-3 day hackathon idea was conceived and launched. So what I have done here is absolutely not production worthy, just a usable solution for my family.

### Additional backstory (optional read)

I started looking for any open source API for chat-gpt and surely the amazing developers out there never disappoint. I quickly settled with a NodeJS implementation from [the folks at transitive-bullshit.](https://github.com/transitive-bullshit/chatgpt-api). They have also published an npm package for convenience which is what I eventually used.
I have an old 2011 iMac running HighSierra OS so I was unable install Node 18 which is required for the package to work and I refused to go to my windows laptop. (lightbulb) my Raspberry Pi that runs all my home automatic docker containers. Ok sorry you had to read that.

### The final system design

```
 ┌─────────────────────────┐
 │                         │
 │        ChatGPT          │
 │                         │
 └───▲────────────────┬────┘
     │                │
     │                │
┌────┼────────────────┼──────┐
│    │  Raspberry Pi  │      │    ┌──────────────────┐     ┌───────────────┐
│    │                │      │    │                  ├─────►               │
│   ┌┴────────────────▼──┐   │    │  Twilio server   │     │   WhatsApp    │
│   │  NodeJS in Docker  │   │    │                  ◄─────┤               │
│   └─────────┬──────────┘   │    └─────────▲────────┘     └───────────────┘
│             │              │              │
│             │              │              │
│        ┌────▼─────┐        │              │
│        │  ngrok   ├────────┼──────────────┘
│        └──────────┘        │
│                            │
└────────────────────────────┘
```

### Installation

#### Pre-requisites [other services you will need]

1.  Create a [Twilio account](https://www.twilio.com/) and create a Twilio sandbox.
2.  Create an [ngrok account](https://ngrok.com/)
3.  Create an [OpenAPI apikey](https://platform.openai.com/overview)
4.  Well you need to have WhatsApp.
5.  Install and configure ngrok on your system. [Installation guide.](https://littlebigtech.net/posts/raspberry-pi-4-minecraft-server-no-port-forwarding/) The installation guide is for minecraft but if you skip down to the ngrok section, you have all you need to do. The only difference is to use this /home/pi/.ngrok2/ngrok.yml content instead

```
tunnels:
 bs-chatgpt:
 proto: http
 addr: 5000
```

6. Now you can go to ngrok website, and check to see that your ngrok proxy is running and you Pi is now exposed to the internet. You will then need to use this public endpoint and set that in your Twilio webhook configuration. Sorry I am not going to go through the details for that but plenty of guides out there. The Twilio webhook is how WhatsApp message can be caught in the NodeJS application. Don't forget the /api/webhook endpoint in the nodejs application so your Twilio webhook target will be something like, https://ngrok.xxx.io/api/webhook
7. Whew, now finally to actually setup the docker container and run.
8. If you raspberry Pi is rebooted, all the Docker containers will auto restart but if you are using a free version of ngrok, that public ip will be changed and therefore you will need to repeat getting the public ngrok url and enter it into Twilio again.

```
git clone https://github.com/hujanais/bs-chat-gpt3-api
cd bs-chat-gpt3-api
cp .env_example .env // create your .env file
# if you are running on a raspberry pi.
docker build -t bs-chat -f Dockerfile.pi .   # use Dockerfile.ubuntu if on linux or cloud
docker run -d -p 5000:5000 --name bs-chat bs-chat
# tip. you can follow the docker log file to see if things are working
docker logs --follow [container-name]
```

### Usage notes

1. I have limited that the whatsapp message to be a minimum of 10 characters so don't just say 'hello' to chat-gpt.
2. Given WhatsApp limited screen size, be prudent with your questions.
3. Finally Chat-GPT maintains conversational context so it remembers what you asked before. If you want to reset this context to start a whole new conversation free from previous history, just send this keyword, **new**(yes this is less than the 10 character limit but this is a special keyword) to chat-gpt and it will reset the context.
4. There is also a session watchdog that you set in the .env file. If a conversation is stopped more than the set timeout, the conversation context will be reset. In other words, the 'new' command will be automatically issued if you left a conversation for a certain duration.
5. One word of caution, if you activate a real Twilio account, the cost may be prohibitive so tread lightly please.

### Developer's notes

These notes are really for me so there will not be much commentary here.

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

### Conclusion

It was a sentimental moment that my parents while facetiming me were able to ask some questions to ChatGPT via WhatsApp. Now these are folks born before the digital computer was even conceived and in their lifetime, they will experience a working NLP AI on a handheld device! Nuff said.
