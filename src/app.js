var app = angular.module('MyApp', ['ui.router']);

//Set default location
app.config(function($urlRouterProvider){  
	$urlRouterProvider.otherwise('/home');
});