'use strict';

userApplicationModule.directive('userAvailable', ['UserResource', function (userResource) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			ctrl.$parsers.unshift(function (viewValue) {
				if (viewValue.trim().length > 0) {
					userResource.query({ UserName : viewValue },
						function (result) {
							if (result.UserName == undefined) {
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