'use strict';

userApplicationModule.directive('userAvailable', function ($http) { // available
    return {
        require: 'ngModel',
        link: function(scope, elem, attr, ctrl) {
            ctrl.$parsers.unshift(function(viewValue) {
                $http.post('/userExist', {
                    UserName: viewValue
                }).success(function (result) {
                    ctrl.$setValidity('userAvailable', result);
                    return viewValue;
                }).error(function () {
                    console.log("error");
                    //ctrl.$setValidity('emailAvailable', false);
                    return viewValue;
                });
            });
        }
    };
});