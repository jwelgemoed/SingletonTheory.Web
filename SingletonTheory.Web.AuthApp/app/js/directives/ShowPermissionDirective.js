'use strict';

userApplicationModule.directive('showPermission', ['AuthService', function (authService) {
	return {
		restrict: 'A',
		link: function ($scope, element, attrs) {
			var prevDisp = element.css('display');

			$scope.$on('currentUser', function () {
				if (!authService.isValidUser())
					return;

				updateCss();
			});

			attrs.$observe('showPermission', function (al) {
				updateCss();
			});

			function updateCss() {
				authService.authorize(function () {
					element.css('display', prevDisp);
				}, function () {
					element.css('display', 'none');
				}, attrs.showPermission);
			}
		}
	};
}]);