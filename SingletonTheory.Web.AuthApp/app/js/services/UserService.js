﻿'use strict';

/// <reference path="~/app/js/app.js" />

userApplicationModule.factory('UserService', function ($http) {
	return {
		//getAll: function (success, error) {
		//	$http.get('/userapi').success(success).error(error);
		//},
		//userExist: function (user, success, error) {
		//	$http.post('/userexistapi', user).success(success).error(error);
		//},
		addUser: function (user, success, error) {
			$http.post('/userapi', user).success(function () {
				success();
			}).error(error);
		},
		updateUser: function (user, success, error) {
			$http.put('/userapi', user).success(success).error(error);
		}
	};
});

var userResource = userApplicationModule.factory('UserResource', function ($resource) {
	return $resource('/userapi', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});

//Id: "@id",
//listController: "@listController",
//docController: "@docController",
//isArray: true