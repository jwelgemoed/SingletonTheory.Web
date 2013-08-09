'use strict';

angular.module('angular-client-side-auth')
	.controller('LoginCtrl',
	['$rootScope', '$scope', '$location', '$window', 'Auth', function ($rootScope, $scope, $location, $window, Auth) {

		$scope.login =
			function () {
				$scope.RememberMe = $scope.RememberMe == undefined ? false : $scope.RememberMe;

				Auth.login({
					UserName: $scope.UserName,
					Password: $scope.Password,
					RememberMe: $scope.RememberMe
				},
				function (res) {
					$location.path('/');
				},
				function (err) {
					$rootScope.error = "Failed to login";
				});
			};

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};
	}]);