app.config(function($stateProvider){
	$stateProvider
	
	//Home
	.state("home", {
		url: "/home",
		templateUrl: "/home/index.html",
		controller: "HomeController"
	})
	
	//Work
	.state("work", {
		url: '/work',
		templateUrl: "/work/index.html",
		controller: "WorkController"
	})
});