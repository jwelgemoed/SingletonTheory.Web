﻿'use strict';

/*
 * An AngularJS Localization Service
 *
 * Written by Jim Lavin
 * http://codingsmackdown.tv
 *
 */

localizationModule.factory('LocalizationDictionaryResource', function ($resource) {
	return $resource('/localize/:locale', {},
	{
		query: { method: 'GET', params: { locale: 'default' }, isArray: false },
		get: { method: 'GET', params: {}, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false },
		remove: { method: 'DELETE', params: {}, isArray: false }
	});
});

localizationModule.factory('LocalizationLocaleCollectionResource', function ($resource) {
	return $resource('/localize/locales', {},
	{
		query: { method: 'GET', params: {}, isArray: false }
	});
});

localizationModule.factory('LocalizationKeyDictionaryResource', function ($resource) {
	return $resource('/localize/keys/:key', {},
	{
		get: { method: 'GET', params: {}, isArray: false },
		add: { method: 'POST', params: {}, isArray: false },
		update: { method: 'PUT', params: {}, isArray: false },
		remove: { method: 'DELETE', params: {}, isArray: false }
	});
});

localizationModule
	// localization service responsible for retrieving resource files from the server and
	// managing the translation dictionary
	.factory('localize', ['$http', '$rootScope', '$window', '$filter', 'dynamicLocale', 'LocalizationDictionaryResource', 'LocalizationKeyDictionaryResource',
		function ($http, $rootScope, $window, $filter, dynamicLocale, LocalizationDictionaryResource) {
			var localize = {
				// use the $window service to get the language of the user's browser
				language: '',
				// array to hold the localized resource string entries
				dictionary: [],
				// flag to indicate if the service hs loaded the resource file
				resourceFileLoaded: false,

				// success handler for all server communication
				successCallback: function (data) {
					// store the returned array in the dictionary
					localize.dictionary = data.LocalizationData;
					// set the flag that the resource are loaded
					localize.resourceFileLoaded = true;
					// broadcast that the file has been loaded
					$rootScope.$broadcast('localizeResourcesUpdates');
				},

				// allows setting of language on the fly
				setLanguage: function (value) {
					localize.language = value;
					localize.initLocalizedResources();
				},

				// loads the language resource file from the server
				initLocalizedResources: function () {
					if (localize.language != '') {
						// request the resource file
						LocalizationDictionaryResource.get({ locale: localize.language }, localize.successCallback, function () {
							// request the default resource file
							LocalizationDictionaryResource.get({ locale: 'default' }, localize.successCallback, error);
						});

						//$http.get('/localize/' + localize.language).success(localize.successCallback).error(function() {
						//	// request the default resource file
						//	$http.get('/localize/default').success(localize.successCallback).error(error);
						//});
						dynamicLocale.set(localize.language);
					}
				},

				// checks the dictionary for a localized resource string
				getLocalizedString: function (value) {
					// default the result to an empty string
					var result = '';

					// make sure the dictionary has valid data
					if ((localize.dictionary !== []) && (localize.dictionary.length > 0)) {
						// use the filter service to only return those entries which match the value
						// and only take the first result
						var entry = $filter('filter')(localize.dictionary, function (element) {
							return element.Key === value;
						}
						)[0];

						// set the result
						if (entry != undefined)
							result = entry.Value;
					}
					// return the value to the call
					if (result == undefined || result == '')
						result = value;
					return result;
				}
			};

			// force the load of the resource file
			localize.initLocalizedResources();

			// return the local instance when called
			return localize;
		}]);
