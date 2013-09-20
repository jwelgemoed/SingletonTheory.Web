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

		$scope.selectedElement = [];

		$scope.selectedAssigned = [];

		$scope.selectedUnAssigned = [];

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.AssignedHeader = 'Assigned Domain Permissions';

		$scope.UnAssignedHeader = 'Available Domain Permissions';

		$scope.hideSublevels = true;

		$scope.editableInPopup = '<button type="button" class="btn btn-default" ng-click="editElement(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.elementGridOptions = {
			data: 'elementDictionary',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			afterSelectionChange: function (data) {
				if ($scope.element != 'Permissions' && $scope.selectedElement.length > 0) {
					setElementSubLists($scope.selectedElement[0].Id);
					$scope.hideSublevels = false;
				}
			}
		};

		$scope.assignedGridOptions = {
			data: 'subElementResource.Assigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedAssigned,
			multiSelect: true
		};

		$scope.unAssignedGridOptions = {
			data: 'subElementResource.UnAssigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedUnAssigned,
			multiSelect: true
		};

		$scope.init = function () {
			$scope.selectElement($scope.element);
		};

		$scope.editElement = function (row) {
			switch ($scope.element) {
				case 'Role':
				case 'Domain Permissions':
					$scope.elementResource.Id = row.entity.Id;
					$scope.elementResource.Label = row.entity.Label;
					$scope.elementResource.Description = row.entity.Description;
					break;
				default:
					$scope.elementResource.Id = row.entity.Id;
					$scope.elementResource.Name = row.entity.Name;
					break;
			}
			$scope.isCollapsed = true;
		};

		$scope.saveSubElements = function () {
			var updateId = 0;
			switch ($scope.element) {
				case 'Role':
					updateId = $scope.subElementResource.RoleId;
					break;
				case 'Domain Permissions':
					updateId = $scope.subElementResource.DomainPermissionId;
					break;
				case 'Functional Permissions':
					updateId = $scope.subElementResource.FunctionalPermissionId;
					break;
			}
			if ($scope.subElementResource != undefined) {
				$scope.subElementResource.$update({ Id: updateId }, function (result) {
				}, function (err) { $scope.error = err; }
					);
			}
		};

		$scope.assign = function (assignFlag) {
			var i = 0;
			if (assignFlag == 'assign') {
				for (i = 0 ; i <= $scope.selectedUnAssigned.length - 1; i++) {
					$scope.subElementResource.Assigned.push($scope.selectedUnAssigned[i]);
					removeElementFromArray($scope.subElementResource.UnAssigned, $scope.selectedUnAssigned[i]);
				}
				$scope.selectedUnAssigned.length = 0;
			}
			if (assignFlag == 'unAssign') {
				for (i = 0; i <= $scope.selectedAssigned.length - 1; i++) {
					$scope.subElementResource.UnAssigned.push($scope.selectedAssigned[i]);
					removeElementFromArray($scope.subElementResource.Assigned, $scope.selectedAssigned[i]);
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
			$scope.hideSublevels = true;
			getElementData();
		};

		$scope.isBasePermission = function () {
			switch ($scope.element) {
				case 'Role':
				case 'Domain Permissions':
					return false;
				default:
					return true;
			}
		};

		$scope.saveElement = function () {
			if ($scope.elementResource.Id == undefined) {
				$scope.elementResource.$add(function () {
					$scope.toggleCollapse();
					getElementData();
				});
			} else {
				$scope.elementResource.$update(function () {
					$scope.toggleCollapse();
					getElementData();
				});
			}
		};

		$scope.cancelElementSave = function () {
			$scope.toggleCollapse();
			setNewResource();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		function setElementSubLists(id) {
			if ($scope.element === 'Permissions') {
				return;
			}
			$scope.subElementResource.$get({ Id: id }, function (result) {
				switch ($scope.element) {
					case 'Role':
						$scope.AssignedHeader = 'Assigned Domain Permissions';
						$scope.UnAssignedHeader = 'Available Domain Permissions';
						break;
					case 'Domain Permissions':
						$scope.AssignedHeader = 'Assigned Functional Permissions';
						$scope.UnAssignedHeader = 'Available Functional Permissions';
						break;
					case 'Functional Permissions':
						$scope.AssignedHeader = 'Assigned Permissions';
						$scope.UnAssignedHeader = 'Available Permissions';
						break;
				}
			}, function (err) { $scope.error = err; }
					);
		};

		function setNewSubElementResource() {
			switch ($scope.element) {
				case 'Role':
					$scope.subElementResource = new AuthAdminRoleDomainPermissionsResource();
					break;
				case 'Domain Permissions':
					$scope.subElementResource = new AuthAdminDomainPermissionFunctionalPermissionsResource();
					break;
				case 'Functional Permissions':
					$scope.subElementResource = new AuthAdmiFunctionalPermissionPermissionsResource();
					break;
				case 'Permissions':
					$scope.subElementResource = undefined;
					break;
			}
		};

		function setNewResource() {
			switch ($scope.element) {
				case 'Role':
					$scope.elementResource = new AuthAdminRoleResource();
					break;
				case 'Domain Permissions':
					$scope.elementResource = new AuthAdminDomainPermissionResource();
					break;
				case 'Functional Permissions':
					$scope.elementResource = new AuthAdminFunctionalPermissionResource();
					break;
				case 'Permissions':
					$scope.elementResource = new AuthAdminPermissionResource();
					break;
			}
		};

		function getElementData() {
			setNewResource();
			setNewSubElementResource();
			switch ($scope.element) {
				case 'Role':
					AuthAdminRolesResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Domain Permissions':
					AuthAdminDomainPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Functional Permissions':
					AuthAdminFunctionalPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case 'Permissions':
					AuthAdminPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};
	}]);

