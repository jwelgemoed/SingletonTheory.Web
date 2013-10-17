'use strict';

userApplicationModule.directive('userAvailable', ['UserResource', function (userResource) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			var availableValidator = function (value) {
				if ($('input').is('[readonly]')) {
					ctrl.$setValidity('useravailability', true);
					return value;
				}
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

userApplicationModule.directive('roleAvailable', ['AuthAdminRoleResource', function (authAdminRoleResource) {
	return {
		require: 'ngModel',
		link: function (scope, elem, attr, ctrl) {
			var availableValidator = function (value) {
				if ($('input').is('[readonly]')) {
					ctrl.$setValidity('roleavailability', true);
					return value;
				}
				if (value !== undefined && value.trim().length > 0) {
					authAdminRoleResource.query({ Label: value },
						function (result) {
							if (result.Label == undefined) {
								ctrl.$setValidity('roleavailability', true);
								return value;
							} else {
								ctrl.$setValidity('roleavailability', false);
								return undefined;
							}
						},
						function (error) {
							ctrl.$setValidity('roleavailability', true);
							return value;
						});
				}
				ctrl.$setValidity('roleavailability', true);
				return value;
			};

			ctrl.$parsers.push(availableValidator);
			ctrl.$formatters.push(availableValidator);
		}
	};
}]);