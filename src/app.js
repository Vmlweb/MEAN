var app = angular.module('MyApp', ['ngRoute']);

app.config(function($routeProvider){  
	$routeProvider.otherwise({redirectTo: '/home'});
});