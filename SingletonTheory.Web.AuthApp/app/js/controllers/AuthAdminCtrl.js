'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminRoleResource', 'AuthAdminDomainPermissionsResource',
	'AuthAdminDomainPermissionResource', 'AuthAdminFunctionalPermissionsResource', 'AuthAdminFunctionalPermissionResource', 'AuthAdminPermissionsResource',
	'AuthAdminPermissionResource', 'AuthAdminRoleDomainPermissionsResource', 'AuthAdminDomainPermissionFunctionalPermissionsResource',
	'AuthAdmiFunctionalPermissionPermissionsResource','localize', 'AuthService',
	function ($rootScope, $scope, AuthAdminRolesResource, AuthAdminRoleResource, AuthAdminDomainPermissionsResource,
		AuthAdminDomainPermissionResource, AuthAdminFunctionalPermissionsResource, AuthAdminFunctionalPermissionResource, AuthAdminPermissionsResource,
		AuthAdminPermissionResource, AuthAdminRoleDomainPermissionsResource, AuthAdminDomainPermissionFunctionalPermissionsResource,
		AuthAdmiFunctionalPermissionPermissionsResource, localize, AuthService) {

		$scope.madeSubListChanges = true;

		$scope.element = '_RoleHeading_';

		$scope.displayElement = '';
		
		$scope.$on('localizeResourcesUpdates', function() {
			$scope.displayElement = localize.getLocalizedString($scope.element);
		});

		$scope.isCollapsed = false;

		$scope.canCreate = false;

		$scope.canUpdate = false;

		$scope.selectedElement = [];

		$scope.selectedAssigned = [];

		$scope.selectedUnAssigned = [];

		$scope.error = '';

		$scope.elementDictionary = [];

		$scope.AssignedHeader = localize.getLocalizedString('_AssignedDomainPermissionHeading_');
		
		$scope.UnAssignedHeader = localize.getLocalizedString('_AvailableDomainPermissionHeading_');

		$scope.hideSublevels = true;

		$scope.editableInPopup = '<button type="button" ng-disabled="!canUpdate" class="btn btn-default" ng-click="editElement(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.sortHeading = localize.getLocalizedString('_SortHeading_');

		$scope.mainColumnDefs = [{ field: 'Label', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
		$scope.assignColumDefs = [{ field: 'Label', displayName: $scope.sortHeading }];

		$scope.$on('localizeResourcesUpdates', function () {
			$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
			$scope.mainColumnDefs = [{ field: 'Label', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
			$scope.assignColumDefs = [{ field: 'Label', displayName: $scope.sortHeading }];
		});

		$scope.elementGridOptions = {
			data: 'elementDictionary',
			columnDefs: 'mainColumnDefs',
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin(), new ngGridLayoutPlugin()],
			afterSelectionChange: function (data) {
				fireSubSelection();
			}
		};

		$scope.assignedGridOptions = {
			data: 'subElementResource.Assigned',
			columnDefs: 'assignColumDefs',
			selectedItems: $scope.selectedAssigned,
			plugins: [new ngGridFlexibleHeightPlugin()],
			multiSelect: true
		};

		$scope.unAssignedGridOptions = {
			data: 'subElementResource.UnAssigned',
			columnDefs: 'assignColumDefs',
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

		$scope.selectElement = function (elementName) {
			$scope.element = elementName;
			setReadWrite();
			$scope.displayElement = localize.getLocalizedString(elementName);
			$scope.hideSublevels = true;
			getElementData();
		};

		function setReadWrite() {
			var createPermissionRequired = '';
			var updatePermissionRequired = '';
			switch ($scope.element) {
				case '_RoleHeading_':
					createPermissionRequired = 'RoleAdministration_Create';
					updatePermissionRequired = 'RoleAdministration_Update';
					break;
				case '_DomainPermissionHeading_':
					createPermissionRequired = 'DomainPermissionAdministration_Create';
					updatePermissionRequired = 'DomainPermissionAdministration_Update';
					break;
				case '_FunctionalPermissionHeading_':
					createPermissionRequired = 'FunctionalPermissionAdministration_Create';
					updatePermissionRequired = 'FunctionalPermissionAdministration_Update';
					break;
				case '_PermissionHeading_':
					createPermissionRequired = 'PermissionAdministration_Create';
					updatePermissionRequired = 'PermissionAdministration_Update';
					break;
			}
			AuthService.authorize(function () {
				$scope.canCreate = true;
			}, function () {
				$scope.canCreate = false;
			}, createPermissionRequired);
			AuthService.authorize(function () {
				$scope.canUpdate = true;
			}, function () {
				$scope.canUpdate = false;
			}, updatePermissionRequired);
		}

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
		
		function removeElementFromArray(elementArray, elementToRemove) {
			for (var i = elementArray.length - 1; i >= 0; i--) {
				if (elementArray[i].Id === elementToRemove.Id) {
					elementArray.splice(i, 1);
				}
			}
		};

		function setElementSubLists(id) {
			$scope.madeSubListChanges = true;
			if ($scope.element === '_PermissionHeading_') {
				return;
			}
			$scope.subElementResource.$get({ Id: id }, function (result) {
				switch ($scope.element) {
					case '_RoleHeading_':
						$scope.AssignedHeader = localize.getLocalizedString('_AssignedDomainPermissionHeading_'); 
						$scope.UnAssignedHeader = localize.getLocalizedString('_AvailableDomainPermissionHeading_');
						break;
					case '_DomainPermissionHeading_':
						$scope.AssignedHeader = localize.getLocalizedString('_AssignedFunctionalPermissionHeading_');
						$scope.UnAssignedHeader = localize.getLocalizedString('_AvailableFunctionalPermissionHeading_');
						break;
					case '_FunctionalPermissionHeading_':
						$scope.AssignedHeader = localize.getLocalizedString('_AssignedPermissionHeading_');
						$scope.UnAssignedHeader = localize.getLocalizedString('_AvailablePermissionHeading_');
						break;
				}
			}, function (err) { $scope.error = err; }
					);
		}

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
		}

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
		}
		
		function fireSubSelection() {
			if ($scope.element != '_PermissionHeading_' && $scope.selectedElement.length > 0) {
				setElementSubLists($scope.selectedElement[0].Id);
				$scope.hideSublevels = false;
			}
		};

		function selectFirst(resultSet) {
			if (resultSet.length > 0) {
				$scope.elementGridOptions.selectedItems[0] = resultSet[0];
				fireSubSelection();
			}
		}

		function getElementData() {
			setNewResource();
			setNewSubElementResource();
			switch ($scope.element) {
				case '_RoleHeading_':
					AuthAdminRolesResource.query({}, function (result) {
						$scope.elementDictionary = result;
						selectFirst(result);
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_DomainPermissionHeading_':
					AuthAdminDomainPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						selectFirst(result);
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_FunctionalPermissionHeading_':
					AuthAdminFunctionalPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						selectFirst(result);
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
		}
	}]);

