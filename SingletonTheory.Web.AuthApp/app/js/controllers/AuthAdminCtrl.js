'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRoleResource', 'AuthAdminGroupLvl2Resource',
	'AuthAdminGroupLvl1Resource', 'AuthAdminPermissionResource', 'authAdminRoleDomainPermissionsResource', 'authAdminDomainPermissionFunctionalPermissionsResource',
	'authAdmiFunctionalPermissionPermissionsResource',
	function($rootScope, $scope, AuthAdminRoleResource, AuthAdminGroupLvl2Resource, AuthAdminGroupLvl1Resource,
		AuthAdminPermissionResource, authAdminRoleDomainPermissionsResource, authAdminDomainPermissionFunctionalPermissionsResource,
		authAdmiFunctionalPermissionPermissionsResource) {

		$scope.element = 'Role';

		$scope.subElements = [];

		$scope.selectedElement = '';

		$scope.selectedAssigned = [];

		$scope.selectedUnAssigned = [];

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.AssignedHeader = 'Assigned Domain Permissions';

		$scope.UnAssignedHeader = 'Available Domain Permissions';

		$scope.hideSublevels = true;

		$scope.init = function() {
			$scope.selectElement($scope.element);
		};

		function selectDeselect(elementArray, elementToSelect) {
			if ($scope.checkArrayForElement(elementArray,elementToSelect)) {
				removeElementFromArray(elementArray, elementToSelect);
			} else {
				elementArray.push(elementToSelect);
			}
		}

		$scope.selectAssigned = function () {
			selectDeselect($scope.selectedAssigned, this.assigned);
		};
		
		$scope.selectUnAssigned = function () {
			selectDeselect($scope.selectedUnAssigned, this.unAssigned);
		};

		$scope.checkArrayForElement = function (elementArray, elementToFind) {
			var found = false;
			for (var i = elementArray.length - 1; i >= 0; i--) {
				if (elementArray[i].Id === elementToFind.Id) {
					found = true;
				}
			}
			return found;
		};

		$scope.assign = function (assignFlag) {
			var i = 0;
			if (assignFlag == 'assign') {
				for (i = 0 ; i <= $scope.selectedUnAssigned.length - 1; i++) {
					$scope.subElements.Assigned.push($scope.selectedUnAssigned[i]);
					removeElementFromArray($scope.subElements.UnAssigned, $scope.selectedUnAssigned[i]);
				}
				$scope.selectedUnAssigned = [];
			}
			if (assignFlag == 'unAssign') {
				for (i = 0; i <= $scope.selectedAssigned.length - 1; i++) {
					$scope.subElements.UnAssigned.push($scope.selectedAssigned[i]);
					removeElementFromArray($scope.subElements.Assigned, $scope.selectedAssigned[i]);
				}
				$scope.selectedAssigned = [];
			}
		};

		function removeElementFromArray(elementArray, elementToRemove) {
			for (var i = elementArray.length - 1; i >= 0; i--) {
				if (elementArray[i].Id === elementToRemove.Id) {
					elementArray.splice(i, 1);
				}
			}
		};

		$scope.selectElement = function (elementName) {
			$scope.element = elementName;
			$scope.subElements = '';
			$scope.selectedElement = '';
			$scope.hideSublevels = true;
			getElementData();
		};

		$scope.getElementSubLists = function () {
			if ($scope.element != 'Permissions') {
				setElementSubLists(this.elementEntry.Id);
				$scope.selectedElement = this.elementEntry;
				$scope.hideSublevels = false;
				$scope.selectedAssigned = [];
				$scope.selectedUnAssigned = [];
			}
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

