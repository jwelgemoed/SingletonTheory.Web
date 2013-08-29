'use strict';

// simple translation filter
// usage {{ TOKEN | i18n }}
localizationModule.filter('i18n', ['localize', function (localize) {
	return function (input) {
		return localize.getLocalizedString(input);
	};
}]);