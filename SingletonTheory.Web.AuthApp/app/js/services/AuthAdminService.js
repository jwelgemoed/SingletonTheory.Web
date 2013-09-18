'use strict';

/// <reference path="~/app/js/app.js" />

var authAdminRoleResource = userApplicationModule.factory('AuthAdminRoleResource', function ($resource) {
	return $resource('/authapi/admin/role', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminRoleDomainPermissionsResource = userApplicationModule.factory('authAdminRoleDomainPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/role/:Id/domainpermissions', {},
	{
		get: { method: 'GET', params: {}, isArray: false }
	});
});

var authAdminGroupLvl2Resource = userApplicationModule.factory('AuthAdminGroupLvl2Resource', function ($resource) {
	return $resource('/authapi/admin/groupLvl2', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminDomainPermissionFunctionalPermissionsResource = userApplicationModule.factory('authAdminDomainPermissionFunctionalPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/domainpermission/:Id/functionalpermissions', {},
	{
		get: { method: 'GET', params: {}, isArray: false }
	});
});

var authAdminGroupLvl1Resource = userApplicationModule.factory('AuthAdminGroupLvl1Resource', function ($resource) {
	return $resource('/authapi/admin/groupLvl1', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdmiFunctionalPermissionPermissionsResource = userApplicationModule.factory('authAdmiFunctionalPermissionPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/functionalpermission/:Id/permissions', {},
	{
		get: { method: 'GET', params: {}, isArray: false }
	});
});

var authAdminPermissionResource = userApplicationModule.factory('AuthAdminPermissionResource', function ($resource) {
	return $resource('/authapi/admin/permission', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});