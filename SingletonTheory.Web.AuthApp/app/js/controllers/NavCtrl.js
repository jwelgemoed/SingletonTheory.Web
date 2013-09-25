'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', 'AuthService', 'breadcrumbs', function ($scope, $location, authService, breadcrumbs) {
	$scope.user = authService.user;
		$scope.userRoles = authService.userRoles;
		$scope.accessLevels = authService.accessLevels;
		$scope.breadcrumbs = breadcrumbs;

		$scope.logout = function () {
			authService.logout(function () {
				$location.path('/login');
			}, function () {
				$rootScope.error = "Failed to logout";
			});
		};
}]);