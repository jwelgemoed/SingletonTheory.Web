﻿'use strict';

/*
 * An AngularJS Localization Service
 *
 * Written by Jim Lavin
 * http://codingsmackdown.tv
 *
 */

localizationModule
	// localization service responsible for retrieving resource files from the server and
	// managing the translation dictionary
	.factory('localize', ['$http', '$rootScope', '$window', '$filter', function($http, $rootScope, $window, $filter) {
		var localize = {
			// use the $window service to get the language of the user's browser
			language: $window.navigator.userLanguage || $window.navigator.language,
			// array to hold the localized resource string entries
			dictionary: [],
			// flag to indicate if the service hs loaded the resource file
			resourceFileLoaded: false,

			// success handler for all server communication
			successCallback: function(data) {
				// store the returned array in the dictionary
				localize.dictionary = data;
				// set the flag that the resource are loaded
				localize.resourceFileLoaded = true;
				// broadcast that the file has been loaded
				$rootScope.$broadcast('localizeResourcesUpdates');
			},

			// allows setting of language on the fly
			setLanguage: function(value) {
				localize.language = value;
				localize.initLocalizedResources();
			},

			// loads the language resource file from the server
			initLocalizedResources: function() {
				// build the url to retrieve the localized resource file
				var url = 'i18n/resources-locale_' + localize.language + '.js';
				// request the resource file
				$http({ method: "GET", url: url, cache: false }).success(localize.successCallback).error(function() {
					// the request failed set the url to the default resource file
					var url = 'i18n/resources-locale_default.js';
					// request the default resource file
					$http({ method: "GET", url: url, cache: false }).success(localize.successCallback);
				});
			},

			// checks the dictionary for a localized resource string
			getLocalizedString: function(value) {
				// default the result to an empty string
				var result = '';

				// make sure the dictionary has valid data
				if ((localize.dictionary !== []) && (localize.dictionary.length > 0)) {
					// use the filter service to only return those entries which match the value
					// and only take the first result
					var entry = $filter('filter')(localize.dictionary, function(element) {
						return element.key === value;
					}
					)[0];

					// set the result
					result = entry.value;
				}
				// return the value to the call
				return result;
			}
		};

		// force the load of the resource file
		localize.initLocalizedResources();

		// return the local instance when called
		return localize;
	}]);
	