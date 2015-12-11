app.config(function($routeProvider){
	$routeProvider.when("/home", {
		templateUrl: "/home/index.html",
		controller: "HomeController"
	});
});

app.controller('HomeController', function($scope) {
	
	$('.masthead').visibility({
	once: false,
	onBottomPassed: function() {
	$('.fixed.menu').transition('fade in');
	},
	onBottomPassedReverse: function() {
	$('.fixed.menu').transition('fade out');
	}
	});
	
	$scope.message = "This page will be used to display add student form";
});