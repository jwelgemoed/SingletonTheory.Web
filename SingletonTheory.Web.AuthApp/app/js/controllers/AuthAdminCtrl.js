'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminRoleResource', 'AuthAdminDomainPermissionsResource',
	'AuthAdminDomainPermissionResource', 'AuthAdminFunctionalPermissionsResource', 'AuthAdminFunctionalPermissionResource', 'AuthAdminPermissionsResource',
	'AuthAdminPermissionResource', 'AuthAdminRoleDomainPermissionsResource', 'AuthAdminDomainPermissionFunctionalPermissionsResource',
	'AuthAdmiFunctionalPermissionPermissionsResource','localize',
	function ($rootScope, $scope, AuthAdminRolesResource, AuthAdminRoleResource, AuthAdminDomainPermissionsResource,
		AuthAdminDomainPermissionResource, AuthAdminFunctionalPermissionsResource, AuthAdminFunctionalPermissionResource, AuthAdminPermissionsResource,
		AuthAdminPermissionResource, AuthAdminRoleDomainPermissionsResource, AuthAdminDomainPermissionFunctionalPermissionsResource,
		AuthAdmiFunctionalPermissionPermissionsResource,localize) {

		$scope.madeSubListChanges = true;

		$scope.element = '_RoleHeading_';

		$scope.displayElement = localize.getLocalizedString($scope.element);

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
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				if ($scope.element != '_PermissionHeading_' && $scope.selectedElement.length > 0) {
					setElementSubLists($scope.selectedElement[0].Id);
					$scope.hideSublevels = false;
				}
			}
		};
		
		$scope.assignedGridOptions = {
			data: 'subElementResource.Assigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedAssigned,
			plugins: [new ngGridFlexibleHeightPlugin()],
			multiSelect: true
		};

		$scope.unAssignedGridOptions = {
			data: 'subElementResource.UnAssigned',
			columnDefs: [{ field: 'Label', displayName: 'Click to sort' }],
			selectedItems: $scope.selectedUnAssigned,
			plugins: [new ngGridFlexibleHeightPlugin()],
			multiSelect: true
		};

		$scope.init = function () {
			$scope.selectElement($scope.element);
		};

		$scope.editElement = function (row) {
			switch ($scope.element) {
				case '_RoleHeading_':
				case '_DomainPermissionHeading_':
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
				case '_RoleHeading_':
					updateId = $scope.subElementResource.RoleId;
					break;
				case '_DomainPermissionHeading_':
					updateId = $scope.subElementResource.DomainPermissionId;
					break;
				case '_FunctionalPermissionHeading_':
					updateId = $scope.subElementResource.FunctionalPermissionId;
					break;
			}
			if ($scope.subElementResource != undefined) {
				$scope.subElementResource.$update({ Id: updateId }, function (result) {
					$scope.madeSubListChanges = true;
				}, function (err) { $scope.error = err; }
					);
			}
		};

		$scope.assign = function (assignFlag) {
			var i = 0;
			if (assignFlag == 'assign') {
				for (i = 0 ; i <= $scope.selectedUnAssigned.length - 1; i++) {
					$scope.madeSubListChanges = false;
					$scope.subElementResource.Assigned.push($scope.selectedUnAssigned[i]);
					removeElementFromArray($scope.subElementResource.UnAssigned, $scope.selectedUnAssigned[i]);
				}
				$scope.selectedUnAssigned.length = 0;
			}
			if (assignFlag == 'unAssign') {
				for (i = 0; i <= $scope.selectedAssigned.length - 1; i++) {
					$scope.madeSubListChanges = false;
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
			$scope.displayElement = localize.getLocalizedString(elementName);
			$scope.hideSublevels = true;
			getElementData();
		};

		$scope.isBasePermission = function () {
			switch ($scope.element) {
				case '_RoleHeading_':
				case '_DomainPermissionHeading_':
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

		$scope.cancelSubElementEdit = function () {
			setElementSubLists($scope.selectedElement[0].Id);
		};

		function setElementSubLists(id) {
			$scope.madeSubListChanges = true;
			if ($scope.element === '_PermissionHeading_') {
				return;
			}
			$scope.subElementResource.$get({ Id: id }, function (result) {
				switch ($scope.element) {
					case '_RoleHeading_':
						$scope.AssignedHeader = 'Assigned Domain Permissions';
						$scope.UnAssignedHeader = 'Available Domain Permissions';
						break;
					case '_DomainPermissionHeading_':
						$scope.AssignedHeader = 'Assigned Functional Permissions';
						$scope.UnAssignedHeader = 'Available Functional Permissions';
						break;
					case '_FunctionalPermissionHeading_':
						$scope.AssignedHeader = 'Assigned Permissions';
						$scope.UnAssignedHeader = 'Available Permissions';
						break;
				}
			}, function (err) { $scope.error = err; }
					);
		};

		function setNewSubElementResource() {
			switch ($scope.element) {
				case '_RoleHeading_':
					$scope.subElementResource = new AuthAdminRoleDomainPermissionsResource();
					break;
				case '_DomainPermissionHeading_':
					$scope.subElementResource = new AuthAdminDomainPermissionFunctionalPermissionsResource();
					break;
				case '_FunctionalPermissionHeading_':
					$scope.subElementResource = new AuthAdmiFunctionalPermissionPermissionsResource();
					break;
				case '_PermissionHeading_':
					$scope.subElementResource = undefined;
					break;
			}
		};

		function setNewResource() {
			switch ($scope.element) {
				case '_RoleHeading_':
					$scope.elementResource = new AuthAdminRoleResource();
					break;
				case '_DomainPermissionHeading_':
					$scope.elementResource = new AuthAdminDomainPermissionResource();
					break;
				case '_FunctionalPermissionHeading_':
					$scope.elementResource = new AuthAdminFunctionalPermissionResource();
					break;
				case '_PermissionHeading_':
					$scope.elementResource = new AuthAdminPermissionResource();
					break;
			}
		};

		function getElementData() {
			setNewResource();
			setNewSubElementResource();
			switch ($scope.element) {
				case '_RoleHeading_':
					AuthAdminRolesResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_DomainPermissionHeading_':
					AuthAdminDomainPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_FunctionalPermissionHeading_':
					AuthAdminFunctionalPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_PermissionHeading_':
					AuthAdminPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		};
	}]);

