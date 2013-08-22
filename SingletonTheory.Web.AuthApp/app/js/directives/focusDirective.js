'use strict';

//angular.module('angular-client-side-auth')
authModule.directive('ngFocus', ['$parse', function ($parse) {
    return function(scope, element, attr) {
        var fn = $parse(attr['ngFocus']);
        element.bind('focus', function(event) {
            scope.$apply(function() {
                fn(scope, { $event: event });
            });
        });
    };
}]);
//.directive('focus', ['$timeout', function ($timeout) {
//    var linkFunc;
//    linkFunc = function (scope, element, attrs) {
//        var setScopeFocus, focusProp;
//        focusProp = attrs['focus'];
//        scope.$watch(focusProp, function (newVal) {
//            if (typeof newVal == 'undefined') return;
//            $timeout(function () {
//                newVal == true && element.focus() || element.blur();
//            }, 0, false);
//        }, true);
//        setScopeFocus = function (val) {
//            scope.$apply(function () {
//                if (typeof scope['focusProp'] == 'function') {
//                    scope['focusProp'](val);
//                }
//                else {
//                    scope['focusProp'] = val;
//                }
//            });
//        };
//        element.bind('focus', function () {
//            setScopeFocus(true);
//        });
//        element.bind('blur', function () {
//            setScopeFocus(false);
//        });
//    };
//    return {
//        restrict: "A",
//        link: linkFunc
//    };
//}]);