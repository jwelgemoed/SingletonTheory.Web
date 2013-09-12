'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', function ($rootScope, $scope) {
	
	$scope.element = "Role";
	
	$scope.selectElement = function (elementName) {
		$scope.element = elementName;
	};

}]);

