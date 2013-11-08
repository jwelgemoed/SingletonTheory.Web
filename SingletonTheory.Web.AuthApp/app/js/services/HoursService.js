'use strict';

/// <reference path="~/app/js/app.js" />

var ItemHoursEntryResource = userApplicationModule.factory('ItemHoursEntryResource', function ($resource) {
	return $resource('/hoursmanagementapi/itementry', {},
	{
	//	query: { method: 'GET', params: { Surname: '' }, isArray: false },
	//	get: { method: 'GET', params: { Id: 0 }, isArray: false },
		add: { method: 'POST', params: {}, isArray: false }
	//	update: { method: 'PUT', params: {}, isArray: false }
	});
});

var ItemHoursEntryResource = userApplicationModule.factory('CostCentreResource', function ($resource) {
	return $resource('/hoursmanagementapi/costcentres', {},
	{
			query: { method: 'GET', params: {}, isArray: true },
		//	get: { method: 'GET', params: { Id: 0 }, isArray: false },
	//	add: { method: 'POST', params: {}, isArray: false }
		//	update: { method: 'PUT', params: {}, isArray: false }
	});
});

var ItemHoursEntryResource = userApplicationModule.factory('HourTypeResource', function ($resource) {
	return $resource('/hoursmanagementapi/hourtypes', {},
	{
			query: { method: 'GET', params: {}, isArray: true },
		//	get: { method: 'GET', params: { Id: 0 }, isArray: false },
	//	add: { method: 'POST', params: {}, isArray: false }
		//	update: { method: 'PUT', params: {}, isArray: false }
	});
});