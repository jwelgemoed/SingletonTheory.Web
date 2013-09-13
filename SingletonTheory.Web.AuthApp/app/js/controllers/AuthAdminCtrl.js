'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRoleResource', 'AuthAdminGroupLvl2Resource',
	'AuthAdminGroupLvl1Resource', 'AuthAdminPermissionResource', function ($rootScope, $scope, AuthAdminRoleResource, AuthAdminGroupLvl2Resource, AuthAdminGroupLvl1Resource,
	AuthAdminPermissionResource) {

		$scope.element = "Role";

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.selectElement = function (elementName) {
			$scope.element = elementName;
			getElementData();
		};
		
		function getElementData () {
			switch ($scope.element) {
				case 'Role':
					AuthAdminRoleResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permission Group Level 1':
					AuthAdminGroupLvl1Resource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permission Group Level 2':
					AuthAdminGroupLvl2Resource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permission':
					AuthAdminPermissionResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};



	}]);

