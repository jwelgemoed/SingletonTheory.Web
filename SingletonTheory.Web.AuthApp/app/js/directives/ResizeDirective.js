userApplicationModule.directive('resizeBody', function ($window) {
	return function (scope, element) {
		var w = angular.element($window);
		var paddingTop = $('#navCtrl').height() + 'px';
		var paddingBottom = $('#footerCtrl').height() + 'px';
		scope.getWindowDimensions = function () {
			paddingTop = $('#navCtrl').height() + 'px';
			paddingBottom = $('#footerCtrl').height() + 'px';
			return { 'h': w.height() };
		};
		scope.$watch(scope.getWindowDimensions, function () {
			element.css('padding-top', paddingTop);
			element.css('padding-bottom', paddingBottom);
			element.height($(window).height() - $('#navCtrl').height() - $('#footerCtrl').height() - 5);
		}, true);
	};
});

userApplicationModule.directive('resizeToBody', function ($window) {
	return function (scope, element, attrs) {
		var bodyHeight = $('body').height();
		var windowElement = angular.element($window);
		var pixelAdjustment = parseInt(attrs.resizeToBody);
		scope.getWindowDimensions = function () {
			bodyHeight = $('body').height();
			return { 'h': windowElement.height() };
		};
		scope.$watch(scope.getWindowDimensions, function () {
			element.height(bodyHeight - pixelAdjustment);
		}, true);
	};
});

