'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', 'AuthService','localize', function ($scope, $location, authService, localize) {
	$scope.user = authService.user;
		$scope.userRoles = authService.userRoles;
		$scope.accessLevels = authService.accessLevels;

		$scope.logout = function () {
			authService.logout(function () {
				$location.path('/login');
			}, function () {
				$rootScope.error = "Failed to logout";
			});
		};

		$scope.setEnglish = function () {
			localize.setLanguage('en-US');
		};
	
		$scope.setDutch = function () {
			localize.setLanguage('nl-nl');
		};
	
}]);