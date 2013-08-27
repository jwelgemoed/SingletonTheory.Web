/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="extensions/angular.scenario.custom.js" />
/// <reference path="extensions/TestHelpers.js" />
/// <reference path="../lib/angular/angular-scenario.js" />

'use strict';

describe('Login Scenario', function () {
	beforeEach(function () {
		browser().navigateTo('/');
	});

	afterEach(function () {
		TestHelpers.logout();
	});

	it('should automatically redirect to /login when location hash/fragment is empty', function () {
		expect(browser().location().url()).toBe('/login');
	});

	it('should fail login for invalid password', function () {
		TestHelpers.login(adminUserUserName, adminUserInvalidPassword);
		expect(browser().location().url()).toBe('/login');
		expect(element('#errorContainer').html()).toContain('Failed to login');
	});

	it('should login with UserName="user"', function () {
		TestHelpers.login(normalUserUserName, normalUserPassword);
		expect(browser().location().url()).toBe('/');
		expect(element('#ng-view').html()).toContain('Welcome to the Dashboard');
	});

	it('should allow user admin to have access to admin menu', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		expect(browser().location().url()).toBe('/');
		expect(element("#adminActionsMenu").css("display")).not().toBe("none");
	});
	
	it('should not allow normal user to have access to admin menu', function () {
		TestHelpers.login(normalUserUserName, normalUserPassword);
		expect(browser().location().url()).toBe('/');
		expect(element("#adminActionsMenu").css("display")).toBe("none");
	});
});