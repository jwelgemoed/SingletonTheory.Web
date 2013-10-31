/// <reference path="../../lib/underscore/underscore-min.js" />
/// <reference path="~/app/js/routingConfig.js" />

'use strict';

userApplicationModule.factory('AuthService', ['$http', '$cookieStore', '$rootScope', 'localize', function ($http, $cookieStore, $rootScope, localize) {

	var accessLevels = routingConfig.accessLevels, userRoles = routingConfig.userRoles;
	var currentUser;
	var defaultUser = { UserName: 'Guest', Language: 'nl-nl', Roles: ['public'] };
	var userFunctionalPermissions = [];

	function setCurrentUser(success, error) {
		if ($rootScope.serverCallBusy == true) {
			if ($rootScope.authCallbacks == undefined)
				$rootScope.authCallbacks = [];

			$rootScope.authCallbacks.push({ Success: success, Error: error });
		}

		$rootScope.serverCallBusy = true;
		$http.get('/authapi/currentuser').success(function (response) {
			if (response == '') {
				currentUser = defaultUser;
				userFunctionalPermissions.length = 0;
			}
			else {
				currentUser = response;
				userFunctionalPermissions.length = 0;
				userFunctionalPermissions = response.Permissions;
			}
			
			localize.setLanguage(currentUser.Language);

			$rootScope.$broadcast('currentUser');

			if (success != undefined)
				success();

			if ($rootScope.authCallbacks != undefined && $rootScope.authCallbacks.length != 0) {
				for (var i = 0; i < callbacks.length; i++) {
					$rootScope.authCallbacks[i].Success();
				}

				$rootScope.authCallbacks.length = 0;
			}
		}).error(function (response){
			error();

			if ($rootScope.authCallbacks.length != 0) {
				for (var i = 0; i < callbacks.length; i++) {
					$rootScope.authCallbacks[i].Error();
				}

				$rootScope.authCallbacks.length = 0;
			}
		});

		$rootScope.serverCallBusy = false;
	};

	function getRole(userRole) {
		if (userRoles.admin.title == userRole) {
			return userRoles.admin;
		}
		else if (userRoles.user.title == userRole) {
			return userRoles.user;
		}
		else {
			return userRoles.public;
		};
	}

	function doAuthorize(success, error, accessPermission) {
		var authorized = (userFunctionalPermissions.indexOf(accessPermission) > -1);
		if (authorized) {
			success();
		}
		else {
			error();
		}
	}

	return {
		isValidUser: function () {
			return currentUser != undefined && currentUser != '' && currentUser.UserName != '';
		},
		getCurrentUser: function () {
			return currentUser;
		},
		authorize: function (success, error, accessPermission) {
			if (!this.isValidUser()) {
				setCurrentUser(function () {
					doAuthorize(success, error, accessPermission);
				}, error);
			}
			else {
				doAuthorize(success, error, accessPermission);
			}
		},
		isLoggedIn: function (user) {
			return user.Roles[0] == userRoles.user.title || user.Roles[0] == userRoles.admin.title;
		},
		login: function (user, success, error) {
			$http.post('/authapi', user).success(function (user) {
				setCurrentUser(success, error);
			}).error(error);
		},
		logout: function (success, error) {
			$http.post('/authapi/logout').success(function () {
				currentUser = null;
				success();
			}).error(error);
		},
		accessLevels: accessLevels,
		userRoles: userRoles
	};
}]);