var app = angular.module('MEAN', ['ui.router']);

//Set default location
app.config(function($urlRouterProvider){  
	$urlRouterProvider.otherwise('/home');
});