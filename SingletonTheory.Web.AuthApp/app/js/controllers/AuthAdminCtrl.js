'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminRoleResource', 'AuthAdminDomainPermissionsResource',
	'AuthAdminDomainPermissionResource', 'AuthAdminFunctionalPermissionsResource', 'AuthAdminFunctionalPermissionResource', 'AuthAdminPermissionsResource',
	'AuthAdminPermissionResource', 'AuthAdminRoleDomainPermissionsResource', 'AuthAdminDomainPermissionFunctionalPermissionsResource',
	'AuthAdmiFunctionalPermissionPermissionsResource',
	function ($rootScope, $scope, AuthAdminRolesResource, AuthAdminRoleResource, AuthAdminDomainPermissionsResource,
		AuthAdminDomainPermissionResource, AuthAdminFunctionalPermissionsResource, AuthAdminFunctionalPermissionResource, AuthAdminPermissionsResource,
		AuthAdminPermissionResource, AuthAdminRoleDomainPermissionsResource, AuthAdminDomainPermissionFunctionalPermissionsResource,
		AuthAdmiFunctionalPermissionPermissionsResource) {

		$scope.element = 'Role';

		$scope.isCollapsed = false;

		$scope.subElements = [];

		$scope.selectedElement = [];

		$scope.selectedAssigned = [];

		$scope.selectedUnAssigned = [];

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.AssignedHeader = 'Assigned Domain Permissions';

		$scope.UnAssignedHeader = 'Available Domain Permissions';

		$scope.hideSublevels = true;

		$scope.elementGridOptions = {
			data: 'elementDictionary',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			afterSelectionChange: function(data) {
				if ($scope.element != 'Permissions' && $scope.selectedElement.length > 0) {
					setElementSubLists($scope.selectedElement[0].Id);
					$scope.hideSublevels = false;
				}
			}
		};
		
		$scope.assignedGridOptions = {
			data: 'subElements.Assigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedAssigned,
			multiSelect: true
		};
		
		$scope.unAssignedGridOptions = {
			data: 'subElements.UnAssigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedUnAssigned,
			multiSelect: true
		};

		$scope.init = function() {
			$scope.selectElement($scope.element);
		};

		$scope.assign = function (assignFlag) {
			var i = 0;
			if (assignFlag == 'assign') {
				for (i = 0 ; i <= $scope.selectedUnAssigned.length - 1; i++) {
					$scope.subElements.Assigned.push($scope.selectedUnAssigned[i]);
					removeElementFromArray($scope.subElements.UnAssigned, $scope.selectedUnAssigned[i]);
				}
				$scope.selectedUnAssigned.length = 0;
			}
			if (assignFlag == 'unAssign') {
				for (i = 0; i <= $scope.selectedAssigned.length - 1; i++) {
					$scope.subElements.UnAssigned.push($scope.selectedAssigned[i]);
					removeElementFromArray($scope.subElements.Assigned, $scope.selectedAssigned[i]);
				}
				$scope.selectedAssigned.length = 0;
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
			if ($scope.subElements.Assigned != undefined) {
				$scope.subElements.Assigned.length = 0;
			}
			if ($scope.subElements.UnAssigned != undefined) {
				$scope.subElements.UnAssigned.length = 0;
			}
			$scope.hideSublevels = true;
			getElementData();
		};

		$scope.descriptionVisibility = function () {
			switch($scope.element) {
				case 'Role':
				case 'Domain Permissions':
					return false;
				default:
					return true;
			}
		};
		
		$scope.LabelVisibility = function () {
			switch ($scope.element) {
				case 'Role':
				case 'Domain Permissions':
					return false;
				default:
					return true;
			}
		};

		$scope.save = function () {
			$scope.elementResource.$add(function () {
				$scope.toggleCollapse();
				getElementData();
			});
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		function setElementSubLists(id) {
			switch ($scope.element) {
				case 'Role':
					AuthAdminRoleDomainPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Domain Permissions';
						$scope.UnAssignedHeader = 'Available Domain Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Domain Permissions':
					AuthAdminDomainPermissionFunctionalPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Functional Permissions';
						$scope.UnAssignedHeader = 'Available Functional Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Functional Permissions':
					AuthAdmiFunctionalPermissionPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Permissions';
						$scope.UnAssignedHeader = 'Available Permissions';
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};

		function getElementData() {
			switch ($scope.element) {
				case 'Role':
					AuthAdminRolesResource.query({}, function (result) {
						$scope.elementDictionary = result;
						$scope.elementResource = new AuthAdminRoleResource();
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Domain Permissions':
					AuthAdminDomainPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						$scope.elementResource = new AuthAdminDomainPermissionResource();
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Functional Permissions':
					AuthAdminFunctionalPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						$scope.elementResource = new AuthAdminFunctionalPermissionResource();
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permissions':
					AuthAdminPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						$scope.elementResource = new AuthAdminPermissionResource();
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};
	}]);

