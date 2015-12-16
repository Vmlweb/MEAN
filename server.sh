#!/bin/bash

if [ "$1" == "setup" ]; then
	
	# Reset production database for mongo
	
	rm -r @@DATADIR
	docker run --name @@DBNAME -d -v @@DATADIR:/data/db -v $PWD/Mongo.js:/home/Mongo.js -it @@DBNAME
	docker exec -i @@DBNAME mongo < ./Mongo.js
	docker stop @@DBNAME
	docker rm @@DBNAME
	
elif [ "$1" == "start" ]; then
	
	# Start the production server in docker
	
	docker run --name @@DBNAME -d -v @@DATADIR:/data/db -it @@DBNAME
	docker run --name @@APPNAME -d -p 80:8080 -p 443:4434 -v @@LOGDIR:/home/logs --link @@DBNAME:mongo -it @@APPNAME
	
elif [ "$1" == "stop" ]; then

	# Stop all server instances

	docker stop @@DBNAME
	docker rm @@DBNAME
	docker stop @@APPNAME
	docker rm @@APPNAME
	
elif [ "$1" == "install" ]; then
	
	# Install node, docker and compose on ubuntu 15.10
	
	sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	sudo echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" > /etc/apt/sources.list.d/docker.list
	sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
	
	sudo apt-get -y update && apt-get -y upgrade
	sudo apt-get -y purge lxc-docker
	sudo apt-cache policy docker-engine
	sudo apt-get install -y nodejs linux-image-extra-$(uname -r) docker-engine
	sudo service docker start
	
	sudo curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	
elif [ "$1" == "clean" ]; then
	
	# Clean temporary docker files and images
	
	sudo docker images --no-trunc | grep none | awk '{print $3}' | xargs -r docker rmi
	sudo docker ps -a --no-trunc | grep 'Exit' | awk '{print $1}' | xargs -r docker rm
	
else

	echo "Commands are start, stop and build"
	
fi