'use strict';

/// <reference path="~/app/js/app.js" />


var TitlesResource = userApplicationModule.factory('TitlesResource', function ($resource) {
	return $resource('/typesapi/titles', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});

var ContactTypesResource = userApplicationModule.factory('ContactTypesResource', function ($resource) {
	return $resource('/typesapi/contacttypes', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});

var EntityTypesResource = userApplicationModule.factory('EntityTypesResource', function ($resource) {
	return $resource('/typesapi/entitytypes', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});

var OccupationNamesResource = userApplicationModule.factory('OccupationNamesResource', function ($resource) {
	return $resource('/typesapi/occupationnames', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});

var AddressTypesResource = userApplicationModule.factory('AddressTypesResource', function ($resource) {
	return $resource('/typesapi/addresstypes', {},
	{
		get: { method: 'GET', params: {}, isArray: true }
	});
});