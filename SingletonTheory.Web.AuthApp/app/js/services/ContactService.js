'use strict';

/// <reference path="~/app/js/app.js" />

var ContactDetailResource = userApplicationModule.factory('ContactDetailResource', function ($resource) {
	return $resource('/contactdetailsapi/contactdetail', {},
	{
		query: { method: 'GET', params: { Surname: '' }, isArray: false },
		get: { method: 'GET', params: { EntityId: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var ContactDetailsResource = userApplicationModule.factory('ContactDetailsResource', function ($resource) {
	return $resource('/contactdetailsapi/contactdetails', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});


var AddressResource = userApplicationModule.factory('AddressResource', function ($resource) {
	return $resource('/contactdetailsapi/address', {},
	{
		query: { method: 'GET', params: { Surname: '' }, isArray: false },
		get: { method: 'GET', params: { Id: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var AddressesResource = userApplicationModule.factory('AddressesResource', function ($resource) {
	return $resource('/contactdetailsapi/addresses', {},
	{
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});

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
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});