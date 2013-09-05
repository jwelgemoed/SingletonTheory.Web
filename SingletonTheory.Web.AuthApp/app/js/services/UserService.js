'use strict';

/// <reference path="~/app/js/app.js" />

var userResource = userApplicationModule.factory('UserResource', function ($resource) {
	return $resource('/userapi', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: { }, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }		
	});
});