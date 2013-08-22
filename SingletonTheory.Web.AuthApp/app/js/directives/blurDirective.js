'use strict';

angular.module('angular-client-side-auth')
.directive('ngBlur', ['$parse', function ($parse) {
    return function(scope, element, attr) {
        var fn = $parse(attr['ngBlur']);
        element.bind('blur', function(event) {
            scope.$apply(function() {
                fn(scope, { $event: event });
            });
        });
    };
}]);
//   .directive('ngBlur', function () {
//    var linkFn = function (scope, el, attrs) {
//        el.bind('blur', function (event) {
//            if (event.type === 'blur') scope.$eval(attrs['ngBlur']);
//        });
//    };
//    return {
//        restrict: 'A',
//        link: linkFn
//    };
//});