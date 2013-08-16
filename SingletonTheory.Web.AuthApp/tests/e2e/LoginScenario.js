﻿/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="extensions/angular.scenario.custom.js" />

'use strict';

describe('Login Scenario', function () {
	beforeEach(function () {
		browser().navigateTo('/');
	});

	afterEach(function () {
		
	});

	it('should equal 42 - Displays how to add custom extensions', function () {
		expect(value(42)).toBe(42);
	});

	it('should automatically redirect to /login when location hash/fragment is empty', function () {
		expect(browser().location().url()).toBe('/login');
	});

	it('should fail login for invalid password', function () {
		expect(browser().location().url()).toBe('/login');
		input('UserName').enter('user');
		input('Password').enter('1234');
		element('button').click();
		//expect(browser().location().url()).toBe('/login');
	});

	it('should login with UserName="user"', function () {
		input('UserName').enter('user');
		input('Password').enter('123');
		element('button').click();
		expect(browser().location().url()).toBe('/'); 
	});
});