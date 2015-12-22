//Modules
var moment = require('moment');
var router = require('express').Router();

//Classes
var Time = require('../app/time.js');

//Request
router.get('/time', function (req, res){
	
	//Create new time object, set format and retrieve value
	var time = new Time();
	time.format = 'dddd, MMMM Do YYYY, h:mm:ss a';
	var currentTime = time.getTime();
	
	//Send time response
	res.json({ time: currentTime });
});

module.exports = router;