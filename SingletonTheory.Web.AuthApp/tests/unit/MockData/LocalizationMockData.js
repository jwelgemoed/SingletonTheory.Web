'use strict';
var mockLocalizationData = angular.module('mockedLocalizationData', []);

mockLocalizationData.value('en-US', {
		enUS: [
			{
				"Id": "521f13e244b433437415e57f",
				"Locale": "en-US",
				"LocalizationItems": [
					{
						"Key": "_TestTitle_",
						"Value": "This comes from the English US file.",
						"Description": "Test title description for English US file"
					}
				]
			}
		]
	}
);

mockLocalizationData.value('nl-nl', {
	nlnl: [
		{
			"Id": "521f13e244b433437415e57f",
			"Locale": "nl-nl",
			"LocalizationItems": [
				{
					"Key": "_TestTitle_",
					"Value": "Deze komen van de Nederlandse bestand.",
					"Description": "Test hoofd voor de Nederlands bestand"
				}
			]
		}
	]
}
);

mockLocalizationData.value('default', {
	defval: [
		{
			"Id": "521f13e244b433437415e57f",
			"Locale": "default",
			"LocalizationItems": [
				{
					"Key": "_TestTitle_",
					"Value": "This comes from the default file.",
					"Description": "Test title description for the default file"
				}
			]
		}
	]
}
);