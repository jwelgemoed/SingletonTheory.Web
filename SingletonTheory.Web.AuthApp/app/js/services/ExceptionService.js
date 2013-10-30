// Override the default global exception handler.
userApplicationModule.factory('$exceptionHandler', ['$injector', function ($injector) {
	var errorForNotification = {
		message: ''
	};

	return function (exception, cause) {
		var rootScope = $injector.get('$rootScope');
		errorForNotification.message = exception.message;

		rootScope.exception = errorForNotification;
		rootScope.$broadcast('ErrorNotification');		
	};
}]);