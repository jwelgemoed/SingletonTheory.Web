'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', '$rootScope', '$exceptionHandler', 'AuthService', 'BreadcrumbService', function ($scope, $location, $rootScope, $exceptionHandler, authService, breadcrumbService) {
	$scope.accessLevels = authService.accessLevels;
	$scope.breadcrumbs = breadcrumbService;
	$scope.appName = 'Bridge';
	$scope.exceptionMessage = '';
	$scope.showException = false;

	$rootScope.$on('ErrorNotification', function () {
		$scope.exceptionMessage = $rootScope.exception.message;
		$scope.showException = !!($rootScope.exception.message != '');
	});

	$scope.$on('currentUser', function () {
		$scope.user = authService.getCurrentUser();
	});

	$scope.removeNotification = function() {
		$scope.exceptionMessage = '';
		$scope.showException = false;
	};

	$scope.logout = function () {
		authService.logout(function () {
			$location.path('/login');
		}, function () {
			$rootScope.error = "Failed to logout";
		});
	};
}]);