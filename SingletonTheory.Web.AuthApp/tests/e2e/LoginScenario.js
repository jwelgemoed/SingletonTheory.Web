/// <reference path="../lib/jasmine/jasmine.js" />

'use strict';

describe('Login Scenario', function() {
	beforeEach(function () {
		browser().navigateTo('/');
	});

	it('should automatically redirect to /login when location hash/fragment is empty', function () {
		expect(browser().location().url()).toBe('/login');
	});

	it('should login with UserName="user"', function () {
		//browser().navigateTo('/');
		input('UserName').enter('user');
		input('Password').enter('123');
		element('button').click();
		expect(browser().location().url()).toBe('/');
	});
});