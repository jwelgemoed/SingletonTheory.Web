'use strict';

//angular.module('angular-client-side-auth')
authModule.factory('Users', function ($http) {
	return {
		getAll: function (success, error) {
			$http.get('/users').success(success).error(error);
		}
	};
});