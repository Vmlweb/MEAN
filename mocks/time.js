//Modules
var mock =  require('mock-require');

//Classes
var Time = require('../classes/time.js');
Time.prototype.getTime = function(){
	return 'Sunday, December 12th 2012, 12:12:12 am';
}

//Apply
mock('../classes/time.js', Time);