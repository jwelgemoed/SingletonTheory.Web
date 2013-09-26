'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', 'AuthService', 'breadcrumbs', function ($scope, $location, authService, breadcrumbs) {
	$scope.userRoles = authService.userRoles;
	$scope.accessLevels = authService.accessLevels;
	$scope.breadcrumbs = breadcrumbs;

	$scope.$on('currentUser', function () {
		$scope.user = authService.getCurrentUser();
	});

	$scope.logout = function () {
		authService.logout(function () {
			$location.path('/login');
		}, function () {
			$rootScope.error = "Failed to logout";
		});
	};
}]);