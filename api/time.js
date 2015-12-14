//Modules
var moment = require('moment');
var router = require('express').Router();

//Classes
var Time = require('../classes/time.js');

//Request
router.get('/time', function (req, res){

	var time = new Time();
	time.format = 'dddd, MMMM Do YYYY, h:mm:ss a';
	
	res.json({ time: time.getTime() });
});

module.exports = router;