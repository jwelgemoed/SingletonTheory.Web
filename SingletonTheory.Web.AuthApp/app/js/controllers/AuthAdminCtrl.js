'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRoleResource', 'AuthAdminGroupLvl2Resource',
	'AuthAdminGroupLvl1Resource', 'AuthAdminPermissionResource', 'authAdminRoleDomainPermissionsResource', 'authAdminDomainPermissionFunctionalPermissionsResource',
	'authAdmiFunctionalPermissionPermissionsResource',
	function ($rootScope, $scope, AuthAdminRoleResource, AuthAdminGroupLvl2Resource, AuthAdminGroupLvl1Resource,
	AuthAdminPermissionResource, authAdminRoleDomainPermissionsResource, authAdminDomainPermissionFunctionalPermissionsResource,
	authAdmiFunctionalPermissionPermissionsResource) {

		$scope.element = 'Role';

		$scope.subElements = [];

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.AssignedHeader = 'Assigned Domain Permissions';

		$scope.UnAssignedHeader = 'Available Domain Permissions';

		$scope.init = function () {
			$scope.selectElement($scope.element);
		};

		$scope.selectElement = function (elementName) {
			$scope.element = elementName;
			$scope.subElements = '';
			getElementData();
		};

		$scope.getElementSubLists = function () {
			setElementSubLists(this.elementEntry.Id);
		};

		function setElementSubLists(id) {
			switch ($scope.element) {
				case 'Role':
					authAdminRoleDomainPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Domain Permissions';
						$scope.UnAssignedHeader = 'Available Domain Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Functional Permissions':
					authAdmiFunctionalPermissionPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Permissions';
						$scope.UnAssignedHeader = 'Available Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Domain Permissions':
					authAdminDomainPermissionFunctionalPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Functional Permissions';
						$scope.UnAssignedHeader = 'Available Functional Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};

		function getElementData () {
			switch ($scope.element) {
				case 'Role':
					AuthAdminRoleResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Functional Permissions':
					AuthAdminGroupLvl1Resource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Domain Permissions':
					AuthAdminGroupLvl2Resource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permissions':
					AuthAdminPermissionResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};



	}]);

