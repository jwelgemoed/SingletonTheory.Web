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
	it('should apply angular localization correctly', function () {
		expect(element('#localeTestHiddenField').val()).toBe('123,456,079.12');
	}
	);
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

	it('user should be able to log out', function () {
		TestHelpers.login(normalUserUserName, normalUserPassword);
		expect(browser().location().url()).toBe('/');
		TestHelpers.logout();
		expect(browser().location().url()).toBe('/login');
	});

	it('should display user administration screen to admin users', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		expect(element('#userAdminContainer').count()).toBe(0);
		element('#adminActionsMenuToggle').click();
		element('#adminUsersMenuItem').click();
		expect(browser().location().url()).toBe('/users');
		expect(element('#userAdminContainer').count()).toBe(1);
	});

	it('should display the add/edit popup to admin users when requested', function () {
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#adminUsersMenuItem').click();
		expect(element('#userAddEditPopupBody').count()).toBe(0);
		expect(browser().location().url()).toBe('/users');
		element('#addUserButton').click();
		expect(element('#userAddEditPopupBody').count()).toBe(1);
	});

	it('should add a random user', function () {
		var userNameToAdd = TestHelpers.makerandomtext();
		var passwordForUser = TestHelpers.makerandomtext();
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#adminUsersMenuItem').click();
		element('#addUserButton').click();
		expect(element('#usersRepeater').html()).not().toContain(userNameToAdd);
		input('addUserDialog.user.UserName').enter(userNameToAdd);
		input('addUserDialog.user.Password').enter(passwordForUser);
		element('#saveNewUserButton').click();
		expect(element('#usersRepeater tr:last td:nth-child(2)').html()).toContain(userNameToAdd);
	});
	
	it('should edit a random user', function () {
		var userNameToAdd = TestHelpers.makerandomtext();
		var passwordForUser = TestHelpers.makerandomtext();
		TestHelpers.login(adminUserUserName, adminUserPassword);
		element('#adminActionsMenuToggle').click();
		element('#adminUsersMenuItem').click();
		element('#addUserButton').click();
		expect(element('#usersRepeater').html()).not().toContain(userNameToAdd);
		input('addUserDialog.user.UserName').enter(userNameToAdd);
		input('addUserDialog.user.Password').enter(passwordForUser);
		element('#saveNewUserButton').click();
		expect(element('#usersRepeater tr:last td:nth-child(2)').html()).toContain(userNameToAdd);
		expect(element('#usersRepeater tr:last td:nth-child(4)').html()).toContain('True');
		element('#usersRepeater tr:last button').click();
		input('addUserDialog.Meta.Active').check();
		element('#saveEditedUserButton').click();
		select('activeFilterDescriptions').option('All Users');
		expect(element('#usersRepeater tr:last td:nth-child(2)').html()).toContain(userNameToAdd);
		expect(element('#usersRepeater tr:last td:nth-child(4)').html()).toContain('False');
	});

});