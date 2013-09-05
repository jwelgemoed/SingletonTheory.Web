/// <reference path="../../lib/underscore/underscore-min.js" />
/// <reference path="~/app/js/routingConfig.js" />

'use strict';

userApplicationModule.factory('AuthService', function ($http, $cookieStore) {

	var accessLevels = routingConfig.accessLevels
			, userRoles = routingConfig.userRoles
			, currentUser = $cookieStore.get('user') || { UserName: '', role: userRoles.public };

	var currentLoggedInUser;

	$cookieStore.remove('user');

	function changeUser(user) {
		_.extend(currentUser, user);
	};

	function getRole(user, success, error) {
		$http.get('/authapi/currentuser').success(function (response) {
			currentLoggedInUser = response;
			if (userRoles.admin.title == response.Roles[0]) {
				user.role = userRoles.admin;
			}
			else if (userRoles.user.title == response.Roles[0]) {
				user.role = userRoles.user;
			}
			else {
				user.role = userRoles.public;
			};

			changeUser(user);
			if (success != undefined)
				success(user);
		}).error(error);
	};

	return {
		getCurrentUser: function () {
			if (currentLoggedInUser != undefined) {
				getRole(currentUser, undefined, undefined);
				return currentLoggedInUser;
			}
		},
		authorize: function (accessLevel, role) {
			if (currentUser == undefined)
				getRole({ UserName: '', role: userRoles.public }, undefined, undefined);

			if (role === undefined)
				role = currentUser.role;

			if (accessLevel == undefined)
				accessLevel = accessLevels.public;

			var authorized = accessLevel.bitMask & role.bitMask;

			return authorized;
		},
		isLoggedIn: function (user) {
			if (user === undefined)
				user = currentUser;
			return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
		},
		login: function (user, success, error) {
			$http.post('/authapi', user).success(function (user) {
				getRole(user, success, error);
			}).error(error);
		},
		logout: function (success, error) {
			$http.post('/authapi/logout').success(function () {
				changeUser({
					UserName: '',
					role: userRoles.public
				});
				success();
			}).error(error);
		},
		accessLevels: accessLevels,
		userRoles: userRoles,
		user: currentUser
	};
});