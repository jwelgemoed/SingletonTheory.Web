'use strict';

userApplicationModule.directive('stInput', ['$compile', function ($compile) {
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

			element.find('div[ng-transclude]').append($compile('<i ng-show="isError" tooltip-append-to-body="true" tooltip-placement="right" tooltip-animation="true" tooltip-html-unsafe="{{errorList}}"  tooltip-trigger="mouseenter" class="icon-exclamation-sign icon-white"></i>')(scope));

			scope.for = id;

			labelHtml = '<label for="' + inputName + '" data-i18n="' + attrs.labelName + '"></label>';

			element.prepend($compile(labelHtml)(scope));

			scope.$parent.$watch(attrs.ngHide, function (hideValue) {
				if (hideValue) {
					element.hide();
				} else {
					element.show();
				}
			});

			scope.$parent.$watch(errorExpression, function (isError) {
				scope.isError = isError;
			});

			scope.$parent.$watch(errorListExpression, function (errorList) {
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
							validationString += '<span ' + colourStyle + '">This field is required</span><br/>';
							break;
						case 'minlength':
							var minLength = element.find(':input').attr('ng-minlength');
							validationString += '<span ' + colourStyle + '">This field has a minimum length of ' + minLength + '</span><br/>';
							break;
						case 'maxlength':
							var maxLength = element.find(':input').attr('ng-maxlength');
							validationString += '<span ' + colourStyle + '">This field has a maximum length of ' + maxLength + '</span><br/>';
							break;
					}
				}
				scope.errorList = validationString;
			}, true);
		}
	};
}]);