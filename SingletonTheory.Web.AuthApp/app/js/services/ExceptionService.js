// Override the default global exception handler.
angular.module('exceptionOverride', []).factory('$exceptionHandler', [function () {
	return function (exception, cause) {
		exception.message += ' (caused by "' + cause + '")';
		//$rootScope.exceptionMessage = exception.message;
		//throw exception;
	};
}]);

//angular.module('st-exceptions', []).factory('$exceptionHandler', '$rootScope', function ($rootScope) {
//	return function (exception, cause) {
//		exception.message += ' (caused by "' + cause + '")';
//		$rootScope.exceptionMessage = exception.message;

//		//throw exception;
//	};
//});