#!/bin/bash

NAME=${2:-@@NAME}
APP=${NAME}_app
DB=${NAME}_db

if [ "$1" == "build" ]; then
	
	docker pull mongo
	docker pull node
	docker build -t mean .
	
elif [ "$1" == "start" ]; then
	
	docker run --name $DB -d -p 27017:27017 -v /opt/$NAME/data:/data/db mongo
	docker run --name $APP -d -p 80:8080 -p 443:4434 -v /opt/$NAME/logs:/home/logs --link $DB:mongo -it mean
	
elif [ "$1" == "dev" ]; then
	
	docker run --name $DB -d -p 27017:27017 -v $PWD/data:/data/db mongo
	docker run --name $APP -p 80:8080 -p 443:4434 -v $PWD:/home -w /home --link $DB:mongo -t node node app
	
elif [ "$1" == "stop" ]; then

	docker stop $DB
	docker stop $APP
	docker rm $DB
	docker rm $APP
	
else

	echo "Commands install, start, stop or dev"
	
fi