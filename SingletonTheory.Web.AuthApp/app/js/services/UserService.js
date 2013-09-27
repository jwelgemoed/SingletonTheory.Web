'use strict';

/// <reference path="~/app/js/app.js" />

var UserResource = userApplicationModule.factory('UserResource', function ($resource) {
	return $resource('/userapi', {},
	{
		query: { method: 'GET', params: { UserName: '' }, isArray: false },
		get: { method: 'GET', params: { Id: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var UsersResource = userApplicationModule.factory('UsersResource', function ($resource) {
	return $resource('/usersapi', {},
	{
		query: { method: 'POST', params: {}, isArray: true },
		get: { method: 'GET', params: {}, isArray: true }
	});
});