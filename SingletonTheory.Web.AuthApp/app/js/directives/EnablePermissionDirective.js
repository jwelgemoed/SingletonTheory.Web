'use strict';

userApplicationModule.directive('enablePermission', ['AuthService', function (authService) {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {

			$scope.$on('currentUser', function () {
				if (!authService.isValidUser())
					return;

				updateCss();
			});

			attrs.$observe('enablePermission', function (al) {
				updateCss();
			});

			function updateCss() {
				authService.authorize(function () {
					element.prop('disabled', false);
				}, function () {
					element.prop('disabled', true);
				}, attrs.enablePermission);
			}
		}
	};
}]);