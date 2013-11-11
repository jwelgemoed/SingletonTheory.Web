'use strict';

//declare module variables used throughout the application
var userApplicationModule = angular.module('user-application', ['ngResource', 'ngCookies', 'ui.bootstrap', 'localization', 'dynamicLocaleModule', 'ngGrid', 'st-breadcrumbs', 'angularTreeview', 'googlechart']);
var dynamicLocaleModule = angular.module('dynamicLocaleModule', []);
var localizationModule = angular.module('localization', ['ngResource']);

// Inject modules needed for app...
userApplicationModule.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

	var access = routingConfig.accessLevels;

	$routeProvider.when('/',
			{
				templateUrl: '/partials/home.html',
				controller: 'HomeCtrl',
				access: 'General_Access'
			});
	$routeProvider.when('/login',
			{
				templateUrl: '/partials/login.html',
				controller: 'LoginCtrl',
				access: 'Guest_Access'
			});
	//$routeProvider.when('/users',
	//		{
	//			templateUrl: '/partials/users.html',
	//			controller: 'UsersCtrl',
	//			access: access.admin
	//		});
	$routeProvider.when('/useradmin',
		{
			templateUrl: '/partials/useradmin.html',
			controller: 'UserAdminCtrl',
			access: 'UserAdministration_Access'
		});
	$routeProvider.when('/auth/authadmin',
			{
				templateUrl: '/partials/authadmin.html',
				controller: 'AuthAdminCtrl',
				access: 'AuthorizationAdministration_Access'
			});
	$routeProvider.when('/auth/localeadmin',
		{
			templateUrl: '/partials/localeadmin.html',
			controller: 'LocaleAdminCtrl',
			access: 'LocalizationAdministration_Access'
		}); 
	$routeProvider.when('/hoursmanagement/bookedhoursinput',
		{
			templateUrl: '/partials/bookedhoursinput.html',
			controller: 'BookedHoursInputCtrl'
			,
			access: 'Administrator_Access'
		});
	$routeProvider.when('/hoursmanagement/budgetedhoursinput',
		{
			templateUrl: '/partials/budgetedhoursinput.html',
			controller: 'BudgetedHoursInputCtrl'
			,
			access: 'Administrator_Access'
		});
	$routeProvider.when('/contactmanagement',
	{
		templateUrl: '/partials/contactmanagement.html',
		controller: 'ContactManagementCtrl'
		,
		access: 'LocalizationAdministration_Access'
	});
	$routeProvider.when('/test',
	{
		templateUrl: '/partials/testpage.html',
		controller: 'TestPageCtrl',
		access: 'LocalizationAdministration_Access'
	});
	//$routeProvider.when('/users/:Id',
	//		{
	//			templateUrl: '/partials/userdetail.html',
	//			controller: 'UserDetailCtrl',
	//			access: access.admin
	//		});
	$routeProvider.when('/404',
			{
				templateUrl: '/partials/404.html',
				access: 'General_Access'
			});
	$routeProvider.otherwise({ redirectTo: '/404' });

	// Enable HTML 5
	$locationProvider.html5Mode(true);
	$locationProvider.hashPrefix('!');

	var interceptor = ['$location', '$q', function ($location, $q) {
		function success(response) {
			return response;
		}

		function error(response) {

			if (response.status === 401) {
				$location.path('/login');
				return $q.reject(response);
			}
			else {
				return $q.reject(response);
			}
		}

		return function (promise) {
			return promise.then(success, error);
		};
	}];

	$httpProvider.responseInterceptors.push(interceptor);
}]).run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, authService) {
	$rootScope.$on("$routeChangeStart", function (event, next, current) {
		$rootScope.error = null;
		authService.authorize(function () {
			var currentPath = $location.path();
			if (currentPath != '') {
				$location.path(currentPath);
			} else {
				$location.path('/');
			}

		}, function () {
			$location.path('/login');
		}, next.access);
	});
}]);

