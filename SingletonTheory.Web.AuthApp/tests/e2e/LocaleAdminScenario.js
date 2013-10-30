/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="extensions/angular.scenario.custom.js" />
/// <reference path="extensions/TestHelpers.js" />
/// <reference path="../lib/angular/angular-scenario.js" />

'use strict';

describe('Login Scenario', function() {
	beforeEach(function() {
		browser().navigateTo('/');
		TestHelpers.logout();
	});

	afterEach(function() {
		TestHelpers.logout();
	});
	
	it('should naviate to the locale admin screen', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#localeAdminMenuItem').click();
		expect(browser().location().url()).toBe('/auth/localeadmin');
		expect(element('#contentCanvas').html()).toContain('Locale Type');
	});

	it('should have locale keys selected by default', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#localeAdminMenuItem').click();
		expect(browser().location().url()).toBe('/auth/localeadmin');
		expect(element('#typeDropDownToggleButtom').html()).toContain('Locale Keys');
	});

	it('should have the first item in the list selected', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#localeAdminMenuItem').click();
		expect(browser().location().url()).toBe('/auth/localeadmin');
		expect(element('#editContainer .ngGrid').html()).toContain('Singleton Theory Auth');
	});

	it('should should be able to select locales for administration', function() {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#localeAdminMenuItem').click();
		expect(browser().location().url()).toBe('/auth/localeadmin');
		element('#typeDropDownToggleButtom').click();
		element('#localeAnchor').click();
		sleep(5);
		expect(element('#infoContainer').html()).toContain('nl-nl');
	});


});