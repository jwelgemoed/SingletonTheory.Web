'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', 'Auth', function ($scope, $location, Auth) {
		$scope.user = Auth.user;
		$scope.userRoles = Auth.userRoles;
		$scope.accessLevels = Auth.accessLevels;

		$scope.logout = function () {
			Auth.logout(function () {
				$location.path('/login');
			}, function () {
				$rootScope.error = "Failed to logout";
			});
		};
	}]);