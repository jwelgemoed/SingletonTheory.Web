'use strict';

/// <reference path="~/app/js/app.js" />

var ContactResource = userApplicationModule.factory('ContactResource', function ($resource) {
	return $resource('/contactdetailsapi/contact', {},
	{
		query: { method: 'GET', params: { Surname: '' }, isArray: false },
		get: { method: 'GET', params: { Id: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var ContactsResource = userApplicationModule.factory('ContactsResource', function ($resource) {
	return $resource('/contactdetailsapi/contacts', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});