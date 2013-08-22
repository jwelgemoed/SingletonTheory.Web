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

	function getRole(user, success, error) {
		$http.get('/roles').success(function (res) {
			if (userRoles.admin.title == res.Roles[0]) {
				user.role = userRoles.admin;
			}
			else if (userRoles.user.title == res.Roles[0]) {
				user.role = userRoles.user;
			}
			else {
				user.role = userRoles.public;
			};

			changeUser(user);
			success(user);
		}).error(error);
	};

	return {
		authorize: function (accessLevel, role) {
			if (role === undefined)
				role = currentUser.role;

			var authorized = accessLevel.bitMask & role.bitMask;

			return authorized;
		},
		isLoggedIn: function (user) {
			if (user === undefined)
				user = currentUser;
			return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
		},
		userExist: function (user, success, error) {
		    $http.post('/userExist', user).success(success).error(error);

		},
		addUser: function (user, success, error) {
			$http.post('/user', user).success(function (res) {
				//changeUser(res);
				success();
			}).error(error);
		},
		updateUser: function (user, success, error) {
		    $http.put('/user', user).success(success).error(error);
		},
		login: function (user, success, error) {
			$http.post('/auth', user).success(function (user) {
				getRole(user, success, error);
			}).error(error);
		},
		logout: function (success, error) {
			$http.post('/auth/logout').success(function () {
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