'use strict';

userApplicationModule.controller('LoginCtrl',
	['$rootScope', '$scope', '$location', '$window', 'AuthService', function ($rootScope, $scope, $location, $window, authService) {
		$scope.user = {
			UserName: '',
			Password: '',
			RememberMe: true
		};

		$scope.login =
			function () {
				$scope.user.RememberMe = $scope.user.RememberMe == undefined ? false : $scope.user.RememberMe;

				authService.login($scope.user,
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