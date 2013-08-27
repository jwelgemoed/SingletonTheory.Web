
var adminUserUserName = 'admin';
var adminUserPassword = '123';
var adminUserInvalidPassword = 'fdsjh';
var normalUserUserName = 'user';
var normalUserPassword = '123';
var normalUserInvalidPassword = 'fdsjh';

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
	},

	makerandomtext: function() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 7; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	},

	confirmrepeatercolumncontainsvalue: function (selector, columntIndex, valueToCheck) {
		element(selector).query(function (tr, done) {
			var hit = false;
			$.each(tr, function (index, value) {
				if (value.cells[columntIndex].innerText == valueToCheck) {
					hit = true;
				}
			});
			expect(value(hit)).toBe(true);
			done();
		});
	}
};



