'use strict';

userApplicationModule.controller('NavCtrl', ['$scope', '$location', '$rootScope', 'AuthService', 'BreadcrumbService', function ($scope, $location, $rootScope, authService, breadcrumbService) {
	//$scope.userRoles = authService.userRoles;
	$scope.accessLevels = authService.accessLevels;
	$scope.breadcrumbs = breadcrumbService;
	$scope.appName = 'Singleton Theory';
	$scope.exceptionMessage = 'Some exception has happened!';
	$scope.showException = true;

	//$rootScope.$watch('exceptionMessage', function () {
	//	$scope.exceptionMessage = $rootScope.exceptionMessage.message;
	//	$scope.showException = !!($scope.exceptionMessage == undefined);
	//});

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