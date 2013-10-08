'use strict';

userApplicationModule.controller('LocaleAdminCtrl',
	['$rootScope', '$scope', 'localize', 'AuthService', function ($rootScope, $scope, localize, AuthService) {

		$scope.localizationType = '_LocaleKeyHeading_';
		$scope.displayLocalizationType = '';

		$scope.isKey = true;

		$scope.canCreate = true;
		$scope.isCollapsed = false;
		
		$scope.$on('localizeResourcesUpdates', function () {
			$scope.displayLocalizationType = localize.getLocalizedString($scope.localizationType);
		});
		
		$scope.init = function () {
			$scope.selectType($scope.localizationType);
		};

		$scope.selectType = function (typeName) {
			$scope.localizationType = typeName;
			$scope.displayLocalizationType = localize.getLocalizedString(typeName);
			if ($scope.localizationType == '_LocaleKeyHeading_') {
				$scope.isKey = true;
			} else {
				$scope.isKey = false;
			}
		};

		$scope.isLocaleKey = function() {
			if ($scope.localizationType == '_LocaleKeyHeading_') {
				return true;
			} else {
				return false;
			}
		};
	}]);