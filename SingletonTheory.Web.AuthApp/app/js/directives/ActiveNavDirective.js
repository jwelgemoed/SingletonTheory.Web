'use strict';

userApplicationModule.directive('activeNav', ['$location', function ($location) {
	return {
		restrict: 'A',
		link: function (scope, element, attrs) {
			var nestedA = element.find('a')[0];
			if (nestedA != undefined)
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