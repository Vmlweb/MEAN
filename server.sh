#!/bin/bash

NAME=${2:-@@NAME}
APP=${NAME}_app
DB=${NAME}_db

if [ "$1" == "build" ]; then
	
	# Build the docker image from local files 
	
	docker pull mongo
	docker pull node
	docker build -t $NAME .
	
elif [ "$1" == "start" ]; then
	
	# Start the docker image in production
	
	docker run --name $DB -d -p 27017:27017 -v /opt/$NAME/data:/data/db mongo
	docker run --name $APP -d -p 80:8080 -p 443:4434 -v /opt/$NAME/logs:/home/logs --link $DB:mongo -it $NAME
	
elif [ "$1" == "dev" ]; then

	# Start a development server with local files
	
	docker run --name $DB -d -p 27017:27017 -v $PWD/data:/data/db mongo
	docker run --name $APP -p 80:8080 -p 443:4434 -v $PWD:/home -w /home --link $DB:mongo -t node node app


elif [ "$1" == "mock" ]; then

	# # Start a development server with local files but with blank database
	
	docker run --name $DB -d -p 27017:27017 mongo
	docker run --name $APP -p 80:8080 -p 443:4434 -v $PWD:/home -w /home --link $DB:mongo -t node node app
	
elif [ "$1" == "stop" ]; then

	# Stop all docker instances

	docker stop $DB
	docker rm $DB
	docker stop $APP
	docker rm $APP
	
elif [ "$1" == "install" ]; then
	
	# Install node and docker on ubuntu
	
	sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	sudo echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" > /etc/apt/sources.list.d/docker.list
	sudo apt-get -y update
	sudo apt-get -y purge lxc-docker
	sudo apt-cache policy docker-engine
	sudo apt-get -y update
	sudo apt-get -y install linux-image-extra-$(uname -r)
	sudo apt-get -y update
	sudo apt-get -y install docker-engine
	sudo service docker start
	sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
	sudo apt-get install -y nodejs
	sudo curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	
elif [ "$1" == "clean" ]; then
	
	# Clean docker temporary images
	
	sudo docker images -notrunc| grep none | awk '{print $3}' | xargs -r docker rmi
	sudo docker ps -a -notrunc | grep 'Exit' | awk '{print $1}' | xargs -r docker rm
	
else

	echo "Commands are builds, start, stop or dev"
	
fi