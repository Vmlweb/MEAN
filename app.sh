#!/bin/bash

if [ "$1" == "install" ]; then
	
	npm install --production
	
elif [ "$1" == "start" ]; then
	
	node app.js
	
else

	echo "Commands install and start"
	
fi