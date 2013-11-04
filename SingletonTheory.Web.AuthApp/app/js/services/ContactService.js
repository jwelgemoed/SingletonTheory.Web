'use strict';

/// <reference path="~/app/js/app.js" />

var ContactResource = userApplicationModule.factory('ContactResource', function ($resource) {
	return $resource('/contactapi', {},
	{
		query: { method: 'GET', params: { Surname: '' }, isArray: false },
		get: { method: 'GET', params: { Id: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var ContactsResource = userApplicationModule.factory('ContactsResource', function ($resource) {
	return $resource('/contactapi', {},
	{
		query: { method: 'POST', params: {}, isArray: true },
		get: { method: 'GET', params: {}, isArray: true }
	});
});