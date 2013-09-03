'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', 'AuthService', function ($scope, $location, authService) {
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
}]);