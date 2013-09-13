'use strict';

/// <reference path="~/app/js/app.js" />

var authAdminRoleResource = userApplicationModule.factory('AuthAdminRoleResource', function ($resource) {
	return $resource('/auth/admin/role', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminGroupLvl2Resource = userApplicationModule.factory('AuthAdminGroupLvl2Resource', function ($resource) {
	return $resource('/auth/admin/groupLvl2', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminGroupLvl1Resource = userApplicationModule.factory('AuthAdminGroupLvl1Resource', function ($resource) {
	return $resource('/auth/admin/groupLvl1', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminPermissionResource = userApplicationModule.factory('AuthAdminPermissionResource', function ($resource) {
	return $resource('/auth/admin/permission', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});