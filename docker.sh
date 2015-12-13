#!/bin/bash

if [ "$1" == "install" ]; then
	
	docker pull mongo
	docker pull node
	docker build -t mean .
	
elif [ "$1" == "start" ]; then
	
	docker run -d -p 27017:27017 -v $PWD/data:/data --name MEAN_Db -d mongo
	docker run -d -p 80:8080 -p 443:4434 --name MEAN_App -it mean
	
elif [ "$1" == "stop" ]; then

	docker stop MEAN_Db
	docker stop MEAN_App
	docker rm MEAN_Db
	docker rm MEAN_App
	
else

	echo "Commands start, stop or build"
	
fi