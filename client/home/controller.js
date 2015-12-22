//Controller
app.controller('HomeController', function($scope, $timeout, $http, TimeService) {
	
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
		
		//Get current time from service
		TimeService.getTime(function(time){
			$scope.time = time;
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