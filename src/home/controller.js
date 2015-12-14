//View
app.config(function($routeProvider){
	$routeProvider.when("/home", {
		templateUrl: "/home/index.html",
		controller: "HomeController"
	});
});

//Controller
app.controller('HomeController', function($scope, $timeout, $http) {
	
	//Setup masthead visibility when scrolling down
	$('.masthead').visibility({
		once: false,
		onBottomPassed: function() {
			$('.fixed.menu').transition('fade in');
		},
		onBottomPassedReverse: function() {
			$('.fixed.menu').transition('fade out');
		}
	});
	
	//Timer for dynamic date
	$scope.time = 'Loading...';
	var tickInterval = 1000;
	var tick = function(){
		
		//Request to backend api or current date
		$http.get('/api/time').then(function success(response){
			$scope.time = response.data.time;
		}, function error(response){
			alert('Server not responding...');
		});
		
		$timeout(tick, tickInterval);
	}
	tick();
	
	//Open and close modal window
	$scope.open_modal = function($scope){
		$('#modal_window').modal('show');
	}
	$scope.close_modal = function($scope){
		$('#modal_window').modal('hide');
	}
	$scope.close_modal_ok = function($scope){
		$scope.close_modal($scope);
	}
});