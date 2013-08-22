'use strict';

userApplicationModule.factory('UserService', function ($http) {
	return {
		getAll: function (success, error) {
			$http.get('/users').success(success).error(error);
		},
		userExist: function (user, success, error) {
			$http.post('/userExist', user).success(success).error(error);
		},
		addUser: function (user, success, error) {
			$http.post('/user', user).success(function (res) {
				//changeUser(res);
				success();
			}).error(error);
		},
		updateUser: function (user, success, error) {
			$http.put('/user', user).success(success).error(error);
		}
	};
});