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

var authAdminRolesResource = userApplicationModule.factory('AuthAdminRolesResource', function ($resource) {
	return $resource('/authapi/admin/roles', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});

var authAdminRoleDomainPermissionsResource = userApplicationModule.factory('AuthAdminRoleDomainPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/role/:Id/domainpermissions', {},
	{
		get: { method: 'GET', params: {}, isArray: false }
	});
});

var authAdminDomainPermissionResource = userApplicationModule.factory('AuthAdminDomainPermissionResource', function ($resource) {
	return $resource('/authapi/admin/domainpermission', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminDomainPermissionsResource = userApplicationModule.factory('AuthAdminDomainPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/domainpermissions', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});

var authAdminDomainPermissionFunctionalPermissionsResource = userApplicationModule.factory('AuthAdminDomainPermissionFunctionalPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/domainpermission/:Id/functionalpermissions', {},
	{
		get: { method: 'GET', params: {}, isArray: false }
	});
});

var authAdminFunctionalPermissionResource = userApplicationModule.factory('AuthAdminFunctionalPermissionResource', function ($resource) {
	return $resource('/authapi/admin/functionalpermission', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false }
	});
});

var authAdminFunctionalPermissionsResource = userApplicationModule.factory('AuthAdminFunctionalPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/functionalpermissions', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});

var authAdmiFunctionalPermissionPermissionsResource = userApplicationModule.factory('AuthAdmiFunctionalPermissionPermissionsResource', function ($resource) {
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

var authAdminPermissionsResource = userApplicationModule.factory('AuthAdminPermissionsResource', function ($resource) {
	return $resource('/authapi/admin/permissions', {},
	{
		query: { method: 'GET', params: {}, isArray: true },
		get: { method: 'GET', params: { Id: 0 }, isArray: true }
	});
});