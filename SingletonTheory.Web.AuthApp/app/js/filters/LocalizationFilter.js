'use strict';

/*
 * An AngularJS Localization Filter
 *
 * Written by Jim Lavin
 * http://codingsmackdown.tv
 *
 */

// simple translation filter
// usage {{ TOKEN | i18n }}
localizationModule.filter('i18n', ['localize', function (localize) {
	return function (input) {
		return localize.getLocalizedString(input);
	};
}]);