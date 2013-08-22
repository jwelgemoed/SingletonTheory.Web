'use strict';

userApplicationModule.factory('UserService', function ($http) {
	return {
		getAll: function (success, error) {
			$http.get('/usersapi').success(success).error(error);
		},
		userExist: function (user, success, error) {
			$http.post('/userexistapi', user).success(success).error(error);
		},
		addUser: function (user, success, error) {
			$http.post('/userapi', user).success(function () {
				success();
			}).error(error);
		},
		updateUser: function (user, success, error) {
			$http.put('/userapi', user).success(success).error(error);
		}
	};
});