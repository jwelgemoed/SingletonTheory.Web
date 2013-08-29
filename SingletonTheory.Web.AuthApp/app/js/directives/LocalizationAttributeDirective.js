'use strict';

// translation directive that can handle dynamic strings
// updates the attribute value of the attached element
// usage <span data-i18n-attr="TOKEN|ATTRIBUTE" ></span>
// or
// <span data-i18n-attr="TOKEN|ATTRIBUTE|VALUE1|VALUE2" ></span>
localizationModule.directive('i18nAttr', ['localize', function (localize) {
	var i18NAttrDirective = {
		restrict: "EAC",
		updateText: function (elm, token) {
			var values = token.split('|');
			// construct the tag to insert into the element
			var tag = localize.getLocalizedString(values[0]);
			// update the element only if data was returned
			if ((tag !== null) && (tag !== undefined) && (tag !== '')) {
				if (values.length > 2) {
					for (var index = 2; index < values.length; index++) {
						var target = '{' + (index - 2) + '}';
						tag = tag.replace(target, values[index]);
					}
				}
				// insert the text into the element
				elm.attr(values[1], tag);
			}
		},
		link: function (scope, elm, attrs) {
			scope.$on('localizeResourcesUpdated', function () {
				i18NAttrDirective.updateText(elm, attrs.i18nAttr);
			});

			attrs.$observe('i18nAttr', function (value) {
				i18NAttrDirective.updateText(elm, value);
			});
		}
	};

	return i18NAttrDirective;
}]);