//Controller
app.controller('NavbarController', function($scope, $location) {

	//Set active navigation bar tab
	$scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };
});