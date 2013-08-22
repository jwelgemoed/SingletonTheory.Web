'use strict';

userApplicationModule.directive('userAvailable', ['UserService', function (userService) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			ctrl.$parsers.unshift(function (viewValue) {
				userService.userExist({
					UserName: viewValue
				}, function (result) {
					ctrl.$setValidity('userAvailable', result);
					return viewValue;
				}, function (error) {
					console.log(error);
					return viewValue;
				});
			});
		}
	};
}]);