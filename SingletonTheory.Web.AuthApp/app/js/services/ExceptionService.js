// Override the default global exception handler.
userApplicationModule.factory('$exceptionHandler', ['$injector', '$log', function ($injector, $log) {
	var errorForNotification = {
		message: ''
	};

	return function (exception, cause) {
		var rootScope = $injector.get('$rootScope');
		errorForNotification.message = exception.message;

		rootScope.exception = errorForNotification;
		rootScope.$broadcast('ErrorNotification');
		if (exception.stack != undefined && exception.stack != '')
			$log.error(exception.stack);
	};
}]);