/// <reference path="../../lib/underscore/underscore-min.js" />
/// <reference path="~/app/js/routingConfig.js" />

'use strict';

userApplicationModule.factory('AuthService', ['$http', '$cookieStore', '$rootScope', 'localize', function ($http, $cookieStore, $rootScope, localize) {

	var accessLevels = routingConfig.accessLevels, userRoles = routingConfig.userRoles;
	var currentUser;
	var defaultUser = { UserName: 'Guest', Language: 'nl-nl', Roles: ['public'] };
	//IMPORTANT NOTE: General access should be given to all users
	var userFunctionalPermissions = [
	'General_Access',
	'Administrator_Access',
	'UserAdministration_Access',
	'AuthorizationAdministration_Access',
	'RoleAdministration_Access',
	'DomainPermissionAdministration_Access',
	'FunctionalPermissionAdministration_Access',
	'PermissionAdministration_Access',
	'RoleAdministration_Write',
	'DomainPermissionAdministration_Write',
	'FunctionalPermissionAdministration_Write',
	'PermissionAdministration_Write'
	];

	function setCurrentUser(success, error) {
		$http.get('/authapi/currentuser').success(function (response) {
			if (response == '') {
				currentUser = defaultUser;
			}
			else {
				currentUser = response;
			}

			localize.setLanguage(currentUser.Language);

			$rootScope.$broadcast('currentUser');

			if (success != undefined)
				success();

		}).error(error);
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