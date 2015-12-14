var app = angular.module('MyApp', ['ngRoute']);

//Set default location
app.config(function($routeProvider){  
	$routeProvider.otherwise({redirectTo: '/home'});
});