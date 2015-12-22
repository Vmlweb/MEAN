#!/bin/bash

if [ "$1" == "reset" ]; then
	
	# Stop production server and database
	
	docker stop @@DBNAME
	docker rm @@DBNAME
	docker stop @@APPNAME
	docker rm @@APPNAME
	docker network rm @@NETNAME
	
	# Reset production database for mongodb
	
	rm -r @@DATADIR
	docker run --name @@DBNAME -d -v @@DATADIR:/data/db -v $PWD/MongoDB.js:/home/MongoDB.js -it @@DBNAME
	docker exec -i @@DBNAME mongo < ./MongoDB.js
	docker stop @@DBNAME
	docker rm @@DBNAME
	
elif [ "$1" == "start" ]; then
	
	# Start the production server in docker
	
	docker network create @@NETNAME
	docker run --net=@@NETNAME --name @@DBNAME -d -p 27017:27017 -v @@DATADIR:/data/db -it @@DBNAME
	docker run --net=@@NETNAME --name @@APPNAME -d -p 80:8080 -p 443:4434 -e "DBNAME=@@DBNAME" -v @@LOGDIR:/home/logs -it @@APPNAME
	
elif [ "$1" == "stop" ]; then

	# Stop all server instances

	docker stop @@DBNAME
	docker rm @@DBNAME
	docker stop @@APPNAME
	docker rm @@APPNAME
	docker network rm @@NETNAME
	
elif [ "$1" == "install" ]; then
	
	# Install node, docker and compose on ubuntu 15.10
	
	sudo apt-key adv --keyserver hkp://p80.pool.sks-keyservers.net:80 --recv-keys 58118E89F3A912897C070ADBF76221572C52609D
	sudo echo "deb https://apt.dockerproject.org/repo ubuntu-wily main" > /etc/apt/sources.list.d/docker.list
	sudo curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
	
	sudo apt-get -y update && apt-get -y upgrade
	sudo apt-get -y purge lxc-docker
	sudo apt-cache policy docker-engine
	sudo apt-get install -y nodejs linux-image-extra-$(uname -r) docker-engine libfontconfig
	sudo service docker start
	
	sudo curl -L https://github.com/docker/compose/releases/download/1.5.2/docker-compose-`uname -s`-`uname -m` > /usr/local/bin/docker-compose
	sudo chmod +x /usr/local/bin/docker-compose
	
elif [ "$1" == "clean" ]; then
	
	# Clean temporary docker files and images
	
	docker run -v /var/run/docker.sock:/var/run/docker.sock -v /var/lib/docker:/var/lib/docker --rm martin/docker-cleanup-volumes
	
else

	echo "Commands are reset, start, stop, install and clean"
	
fi