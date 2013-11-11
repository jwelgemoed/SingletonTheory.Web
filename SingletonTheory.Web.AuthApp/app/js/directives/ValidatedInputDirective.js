'use strict';

userApplicationModule.directive('stInput', ['$compile', '$filter', 'localize', function ($compile, $filter, localize) {
	return {
		restrict: 'E',
		transclude: true,
		require: '^form',
		replace: true,
		scope: {},
		template:
				'<div class="control-group" ng-class="{error: isError}">' +
							'<div class="controls" >' +
							'<div ng-transclude></div></div></div>',
		link: function (scope, element, attrs, formController) {
			var labelHtml = '';
			var id = element.find(':input').attr('id');
			var inputName = element.find(':input').attr('name');
			var errorExpression = [formController.$name, inputName, '$invalid'].join('.');
			var errorListExpression = [formController.$name, inputName, '$error'].join('.');
			var rawErrors;
			var labelClass = '';

			element.find('div[ng-transclude]').append($compile('<i ng-show="isError" tooltip-append-to-body="true" tooltip-placement="right" tooltip-animation="true" tooltip-html-unsafe="{{errorList}}"  tooltip-trigger="mouseenter" class="icon-exclamation-sign icon-white"></i>')(scope));

			scope.for = id;

			if (attrs.labelClass !== undefined) {
				labelClass = 'class="' + attrs.labelClass + '"';
			}

			labelHtml = '<label for="' + inputName + '" ' + labelClass + ' data-i18n="' + attrs.labelName + '"></label>';

			element.prepend($compile(labelHtml)(scope));

			if (attrs.stHide !== undefined) {
				scope.$parent.$watch(attrs.stHide, function (hideValue) {
					if (hideValue) {
						element.hide();
					} else {
						element.show();
					}
				});
			}

			scope.$parent.$watch(errorExpression, function (isError) {
				scope.isError = isError;
			});

			scope.$on('localizeResourcesUpdates', function () {
				updateTooltip(rawErrors);
			});

			scope.$parent.$watch(errorListExpression, function (errorList) {
				updateTooltip(errorList);
				rawErrors = errorList;
			}, true);

			var updateTooltip = function (errorList) {
				var validationString = '';
				var colourStyle = '';
				var properties = Object.keys(errorList);
				for (var i = 0; i < properties.length; i++) {
					if (errorList[properties[i]]) {
						colourStyle = 'style="color:red!important;"';
					} else {
						colourStyle = 'style="color:white!important;"';
					}
					switch (properties[i]) {
						case 'required':
							validationString += '<span ' + colourStyle + '">' + localize.getLocalizedString('_requiredFieldDescription_') + '</span><br/>';
							for (var index = 0; index < properties.length; index++) {
								if (properties[index] == 'number') {
									validationString += '<span ' + colourStyle + '">' + localize.getLocalizedString('_numberCheckDescription_') + '</span><br/>';
								}
							}
							break;
						case 'useravailability':
							validationString += '<span ' + colourStyle + '">' + localize.getLocalizedString('_userAvailabilityDescription_') + '</span><br/>';
							break;
						case 'minlength':
							var minLength = element.find(':input').attr('ng-minlength');
							var minLengthDescription = $filter('stringFormat')(localize.getLocalizedString('_minLengthDescription_'), [minLength]);
							validationString += '<span ' + colourStyle + '">' + minLengthDescription + '</span><br/>';
							break;
						case 'maxlength':
							var maxLength = element.find(':input').attr('ng-maxlength');
							var maxLengthDescription = $filter('stringFormat')(localize.getLocalizedString('_maxLengthDescription_'), [maxLength]);
							validationString += '<span ' + colourStyle + '">' + maxLengthDescription + '</span><br/>';
							break;
						case 'min':
							var min = element.find(':input').attr('min');
							var minDescription = $filter('stringFormat')(localize.getLocalizedString('_minValueDescription_'), [min]);
							validationString += '<span ' + colourStyle + '">' + minDescription + '</span><br/>';
							break;
						case 'max':
							var max = element.find(':input').attr('max');
							var maxDescription = $filter('stringFormat')(localize.getLocalizedString('_maxValueDescription_'), [max]);
							validationString += '<span ' + colourStyle + '">' + maxDescription + '</span><br/>';
							break;
					}
				}
				scope.errorList = validationString;
			};
		}
	};
}]);