/// <reference path="../../lib/underscore/underscore-min.js" />

'use strict';

angular.module('angular-client-side-auth')
.factory('Auth', function ($http, $cookieStore) {

	var accessLevels = routingConfig.accessLevels
			, userRoles = routingConfig.userRoles
			, currentUser = $cookieStore.get('user') || { UserName: '', role: userRoles.public };

	$cookieStore.remove('user');

	function changeUser(user) {
		_.extend(currentUser, user);
	};

	return {
		authorize: function (accessLevel, role) {
			if (role === undefined)
				role = currentUser.role;

			return accessLevel.bitMask & role.bitMask;
		},
		isLoggedIn: function (user) {
			if (user === undefined)
				user = currentUser;
			return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
		},
		register: function (user, success, error) {
			$http.post('/register', user).success(function (res) {
				changeUser(res);
				success();
			}).error(error);
		},
		login: function (user, success, error) {
			$http.post('/auth', user).success(function (user) {
				changeUser(user);
				success(user);
			}).error(error);
		},
		logout: function (success, error) {
			$http.post('/logout').success(function () {
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