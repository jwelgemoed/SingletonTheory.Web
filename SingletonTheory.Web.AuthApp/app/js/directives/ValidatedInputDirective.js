'use strict';

userApplicationModule.directive('stInput', function () {
	return {
		restrict: 'E',
		transclude: true,
		require: '^form',
		replace: true,
		scope: {},
		template:
				'<div class="control-group"   ng-class="{error: isError}">' +
							'<label for="Name" data-i18n="_Name5MinCharsHeading_"></label>' +
							'<div class="controls row-fluid" >' +
							'<div ng-transclude></div>' +
							'<i ng-show="isError" tooltip-append-to-body="true" tooltip-placement="right" tooltip-animation="true" tooltip-html-unsafe="{{errorList}}"  tooltip-trigger="mouseenter" class="icon-exclamation-sign icon-white"></i>' +
							'</div>' +
						'</div>',
		link: function (scope, element, attrs, formController) {
			// The <label> should have a `for` attribute that links it to the input.
			// Get the `id` attribute from the input element
			// and add it to the scope so our template can access it.
			var id = element.find(":input").attr("id");
			scope.for = id;

			// Get the `name` attribute of the input
			var inputName = element.find(":input").attr("name");
			// Build the scope expression that contains the validation status.
			// e.g. "form.example.$invalid"
			var errorExpression = [formController.$name, inputName, "$invalid"].join(".");
			// Watch the parent scope, because current scope is isolated.
			scope.$parent.$watch(errorExpression, function (isError) {
				scope.isError = isError;
			});

			var errorListExpression = [formController.$name, inputName, "$error"].join(".");
			// Watch the parent scope, because current scope is isolated.
			scope.$parent.$watch(errorListExpression, function (errorList) {
				var validationString = '';
				var colourClass = '';
				var properties = Object.keys(errorList);
				for (var i = 0; i < properties.length; i++) {
					if (errorList[properties[i]]) {
						colourClass = 'class="errorValidation"';
					} else {
						colourClass = 'class="passedValidation"';
					}
					switch (properties[i]) {
						case 'required':
							validationString += '<span ' + colourClass + '">This field is required</span><br/>';
							break;
						case 'minlength':
							validationString += '<span ' + colourClass + '">This field has a minimum length</span><br/>';
							break;
						case 'maxlength':
							validationString += '<span ' + colourClass + '">This field has a maximum length</span><br/>';
							break;
					}
				}
				scope.errorList = validationString;
			}, true);
		}
	};
});