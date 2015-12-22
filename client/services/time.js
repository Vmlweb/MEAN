//Service
app.service('TimeService', function($http){
	
	//Method to retrieve time as tring
	this.getTime = function(callback){
		
		//Making requests to the backend api
		$http.get('/api/time').then(function success(response){
			callback(response.data.time);
		}, function error(response){
			callback('Server not responding...');
		});
	}
});