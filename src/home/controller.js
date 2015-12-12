app.config(function($routeProvider){
	$routeProvider.when("/home", {
		templateUrl: "/home/index.html",
		controller: "HomeController"
	});
});

app.controller('HomeController', function($scope, $timeout) {
	
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
	
	$scope.message = "Open Window"
	
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