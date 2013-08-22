'use strict';

//angular.module('angular-client-side-auth')
authModule.directive('activeNav', ['$location', function ($location) {
		return {
			restrict: 'A',
			link: function (scope, element, attrs) {
				var nestedA = element.find('a')[0];
				var path = nestedA.href;

				scope.location = $location;
				scope.$watch('location.absUrl()', function (newPath) {
					if (path === newPath) {
						element.addClass('active');
					} else {
						element.removeClass('active');
					}
				});
			}
		};
	}]);