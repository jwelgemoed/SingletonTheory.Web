userApplicationModule.directive('resizeToWindow', function($window) {
	return function(scope, element) {
		var w = angular.element($window);
		scope.getWindowDimensions = function() {
			return { 'h': w.height() };
		};
		scope.$watch(scope.getWindowDimensions, function(newValue, oldValue) {
			scope.windowHeight = newValue.h;

			scope.styleToWindow = function() {
				return {
					'height': (newValue.h - 200) + 'px'
				};
			};

		}, true);

		w.bind('resizeToWindow', function() {
			scope.$apply();
		});
	};
});

userApplicationModule.directive('resizeToParent', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		var parent = element.parent();
		scope.getParentHeight = function () {
			return { 'h': parent.height() };
		};
		scope.$watch(scope.getParentHeight, function (newValue, oldValue) {

			scope.styleToParent = function () {
				return {
					'height': (newValue.h - 100) + 'px'
				};
			};

		}, true);

		w.bind('resizeToParent', function () {
			scope.$apply();
		});
	};
});