'use strict';

userApplicationModule.directive('userAvailable', ['UsersResource', function (usersResource) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			ctrl.$parsers.unshift(function (viewValue) {
				if (viewValue.trim().length > 0) {
					usersResource.query({ UserNames: [ viewValue ] },
						function (result) {
							if (result.length == 0) {
								ctrl.$setValidity('userAvailable', true);
							}
							else {
								ctrl.$setValidity('userAvailable', false);
							}
							
							return viewValue;
						},
						function(error) {
							ctrl.$setValidity('userAvailable', true);
							return viewValue;
						});
				}
				return viewValue;
			});
		}
	};
}]);