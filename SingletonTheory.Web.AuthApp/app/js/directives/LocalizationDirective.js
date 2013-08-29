'use strict';

// translation directive that can handle dynamic strings
// updates the text value of the attached element
// usage <span data-i18n="TOKEN" ></span>
// or
// <span data-i18n="TOKEN|VALUE1|VALUE2" ></span>
localizationModule.directive('i18n', ['localize', function (localize) {
	var i18nDirective = {
		restrict: "EAC",
		updateText: function(elm, token) {
			var values = token.split('|');
			if (values.length >= 1) {
				// construct the tag to insert into the element
				var tag = localize.getLocalizedString(values[0]);
				// update the element only if data was returned
				if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
					if (values.length > 1) {
						for (var index = 1; index < values.length; index++) {
							var target = '{' + (index - 1) + '}';
							tag = tag.replace(target, values[index]);
						}
					}
					// insert the text into the element
					elm.text(tag);
				}
				;
			}
		},

		link: function(scope, elm, attrs) {
			scope.$on('localizeResourcesUpdates', function() {
				i18nDirective.updateText(elm, attrs.i18n);
			});

			attrs.$observe('i18n', function(value) {
				i18nDirective.updateText(elm, attrs.i18n);
			});
		}
	};

	return i18nDirective;
}]);