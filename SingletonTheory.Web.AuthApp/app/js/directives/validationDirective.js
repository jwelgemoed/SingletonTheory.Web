'use strict';

userApplicationModule.directive('userAvailable', ['UserResource', function (userResource) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
				var availableValidator = function(value) {
					if (value !== undefined && value.trim().length > 0) {
						userResource.query({ UserName: value },
							function(result) {
								if (result.UserName == undefined) {
									ctrl.$setValidity('useravailability', true);
									return value;
								} else {
									ctrl.$setValidity('useravailability', false);
									return undefined;
								}
							},
							function(error) {
								ctrl.$setValidity('useravailability', true);
								return value;
							});
					}
					ctrl.$setValidity('useravailability', true);
					return value;
				};
				
				ctrl.$parsers.push(availableValidator);
				ctrl.$formatters.push(availableValidator);
		}
	};
}]);