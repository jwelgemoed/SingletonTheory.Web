'use strict';

userApplicationModule.directive('resizeTo', function ($window) {
	return {
		link: {
			pre: function preLink(scope, element, attrs) {
				var parentElementHeight = 0;
				var paddingTop = '';
				var paddingBottom = '';
				var windowElement = angular.element($window);
				var pixelAdjustment = parseInt(attrs.resizeReduction);

				scope.getParentChanged = function () {
						return { 'h': windowElement.height() };
				};
				
				scope.$watch(scope.getParentChanged, function (newValue, oldValue) {
					if (attrs.resizeTo == 'navbars') {
						// body padding-top read from navcontrol
						paddingTop = $('#navCtrl').height() + 'px';
						element.css('padding-top', paddingTop);
						paddingTop = parseInt(paddingTop, 10);

						// body padding-bottom read from css value
						paddingBottom = element.css('padding-bottom');
						paddingBottom = parseInt(paddingBottom, 10);
						element.height($(window).height() - paddingTop - paddingBottom - 5);
					} else {
						switch (attrs.resizeType) {
							case 'element':
								parentElementHeight = $(attrs.resizeTo).height();
								break;
							case 'class':
								parentElementHeight = $('.' + attrs.resizeTo).height();
								break;
							case 'elementId':
								parentElementHeight = $('#' + attrs.resizeTo).height();
								break;
						}
						element.height(parentElementHeight - pixelAdjustment);
					}
				}, true);
				windowElement.bind('resize', function () {
					scope.$apply();
				});
			}
		}
	};
});

