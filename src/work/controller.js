app.config(function($routeProvider){
	$routeProvider.when("/work", {
		templateUrl: "/work/index.html",
		controller: "WorkController"
	});
});

app.controller('WorkController', function($scope) {
	
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
});