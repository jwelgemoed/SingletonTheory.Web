'use strict';

angular.module('angular-client-side-auth')
	.controller('HomeCtrl',
	['$rootScope', function ($rootScope) { }]);

angular.module('angular-client-side-auth')
	.controller('RegisterCtrl',
	['$rootScope', '$scope', '$location', 'Auth', function ($rootScope, $scope, $location, Auth) {
		$scope.role = Auth.userRoles.user;
		$scope.userRoles = Auth.userRoles;

		$scope.register =
			function () {
				Auth.register({
					UserName: $scope.UserName,
					Password: $scope.Password,
					role: $scope.role
				},
			function () {
				$location.path('/');
			},
			function (err) {
				$rootScope.error = err;
			});
			};
	}]);