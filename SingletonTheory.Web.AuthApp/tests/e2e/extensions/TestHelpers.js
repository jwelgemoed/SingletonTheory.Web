
var adminUserUserName = 'admin';
var adminUserPassword = '123';
var adminUserInvalidPassword = 'fdsjh';
var normalUserUserName = 'user';
var normalUserPassword = '123';
var normalUserInvalidPassword = 'fdsjh';
var dutchUserUserName = 'nlgebruiker';
var dutchUserPassword = '123';

var TestHelpers = {
login: function (userName, password) {
		expect(browser().location().url()).toBe('/login');
		input('user.UserName').enter(userName);
		input('user.Password').enter(password);
		element('#loginButton').click();
	},
	
logout: function () {
		element('#logoutButton').click();
},

	makerandomtext: function() {
		var text = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		for (var i = 0; i < 7; i++)
			text += possible.charAt(Math.floor(Math.random() * possible.length));
		return text;
	}

};



