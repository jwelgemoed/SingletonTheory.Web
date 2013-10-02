/// <reference path="../../lib/underscore/underscore-min.js" />
/// <reference path="~/app/js/routingConfig.js" />

'use strict';

userApplicationModule.factory('AuthService', ['$http', '$cookieStore', '$rootScope', 'localize', function ($http, $cookieStore, $rootScope, localize) {

	var accessLevels = routingConfig.accessLevels, userRoles = routingConfig.userRoles;
	var currentUser;
	var defaultUser = { UserName: 'Guest', Language: 'nl-nl', Roles: ['public'] };

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

	function doAuthorize(success, error, accessLevel) {
		var role = getRole(currentUser.Roles[0]);

		if (accessLevel == undefined)
			accessLevel = accessLevels.public;

		var authorized = accessLevel.bitMask & role.bitMask;
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
		authorize: function (success, error, accessLevel, role) {
			if (!this.isValidUser()) {
				setCurrentUser(function () {
					//doAuthorize(success, error, accessLevel, role);
				}, error);
			}
			else {
				//doAuthorize(success, error, accessLevel, role);
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