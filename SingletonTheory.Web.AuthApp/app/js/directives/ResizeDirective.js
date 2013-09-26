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
						paddingTop = $('#navCtrl').height() + 'px';
						paddingBottom = $('#footerCtrl').height() + 'px';
						element.css('padding-top', paddingTop);
						element.css('padding-bottom', paddingBottom);
						element.height($(window).height() - $('#navCtrl').height() - $('#footerCtrl').height() - 5);
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

