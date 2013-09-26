'use strict';

userApplicationModule.directive('accessLevel', ['AuthService', function (authService) {
		return {
			restrict: 'A',
			link: function ($scope, element, attrs) {
				var prevDisp = element.css('display'), accessLevel;

				$scope.$on('currentUser', function () {
					if (!authService.isValidUser())
						return;

					updateCSS();
				});

				attrs.$observe('accessLevel', function (al) {
					if (al)
						accessLevel = $scope.$eval(al);

					updateCSS();
				});

				function updateCSS() {
					//if (userRole && accessLevel) {
						authService.authorize(function () {
							element.css('display', prevDisp);
						}, function () {
							element.css('display', 'none');
						}, accessLevel);
					//}
				}
			}
		};
	}]);