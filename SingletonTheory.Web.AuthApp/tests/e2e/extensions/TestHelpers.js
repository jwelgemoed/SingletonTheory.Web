
var TestHelpers = {

	login: function (userName, password) {
		expect(browser().location().url()).toBe('/login');
		input('UserName').enter(userName);
		input('Password').enter(password);
		element('#loginButton').click();
	},
	
	logout: function () {
		element('#logoutButton').click();
		expect(browser().location().url()).toBe('/login');
	}	
};



