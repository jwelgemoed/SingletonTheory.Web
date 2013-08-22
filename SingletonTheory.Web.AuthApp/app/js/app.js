'use strict';

var authModule = angular.module('angular-client-side-auth', ['ngCookies', 'ui.bootstrap']);

authModule.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

				var access = routingConfig.accessLevels;

				$routeProvider.when('/',
						{
							templateUrl: '/partials/home.html',
							controller: 'HomeCtrl',
							access: access.user
						});
				$routeProvider.when('/login',
						{
							templateUrl: '/partials/login.html',
							controller: 'LoginCtrl',
							access: access.anon
						});
				$routeProvider.when('/register',
						{
							templateUrl: '/partials/register.html',
							controller: 'RegisterCtrl',
							access: access.admin
						});
				$routeProvider.when('/private',
						{
							templateUrl: '/partials/private.html',
							controller: 'PrivateCtrl',
							access: access.user
						});
				$routeProvider.when('/admin',
						{
							templateUrl: '/partials/admin.html',
							controller: 'AdminCtrl',
							access: access.admin
						});
				$routeProvider.when('/404',
						{
							templateUrl: '/partials/404.html',
							access: access.public
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
					}
				}];

				$httpProvider.responseInterceptors.push(interceptor);
			}])

		.run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
			$rootScope.$on("$routeChangeStart", function (event, next, current) {
				$rootScope.error = null;
				if (!Auth.authorize(next.access)) {
					if (Auth.isLoggedIn()) $location.path('/');
					else $location.path('/login');
				}
			});
		}]);