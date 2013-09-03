'use strict';

userApplicationModule.controller('LoginCtrl',
	['$rootScope', '$scope', '$location', '$window', 'AuthService', 'localize', function ($rootScope, $scope, $location, $window, authService, localize) {

		$scope.login =
			function () {
				$scope.RememberMe = $scope.RememberMe == undefined ? false : $scope.RememberMe;

				authService.login({
					UserName: $scope.UserName,
					Password: $scope.Password,
					RememberMe: $scope.RememberMe
				},
				function (res) {
					$location.path('/');
					var loggedInUser = authService.getCurrentUser();
					localize.setLanguage(loggedInUser.Meta.Language);
				},
				function (err) {
					$rootScope.error = "Failed to login";
				});
			};

		$scope.loginOauth = function (provider) {
			$window.location.href = '/auth/' + provider;
		};
	}]);