'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminRoleResource', 'AuthAdminDomainPermissionsResource',
	'AuthAdminDomainPermissionResource', 'AuthAdminFunctionalPermissionsResource', 'AuthAdminFunctionalPermissionResource', 'AuthAdminPermissionsResource',
	'AuthAdminPermissionResource', 'AuthAdminRoleDomainPermissionsResource', 'AuthAdminDomainPermissionFunctionalPermissionsResource',
	'AuthAdmiFunctionalPermissionPermissionsResource', 'AuthAdminRoleTreeResource', 'AuthAdminRolesRoleCanMoveToResource', 'localize', 'AuthService',
	function ($rootScope, $scope, authAdminRolesResource, authAdminRoleResource, authAdminDomainPermissionsResource,
		authAdminDomainPermissionResource, authAdminFunctionalPermissionsResource, authAdminFunctionalPermissionResource, authAdminPermissionsResource,
		authAdminPermissionResource, authAdminRoleDomainPermissionsResource, authAdminDomainPermissionFunctionalPermissionsResource,
		authAdmiFunctionalPermissionPermissionsResource, authAdminRoleTreeResource, authAdminRolesRoleCanMoveToResource, localize, authService) {

		$scope.madeSubListChanges = true;
		$scope.isRole = true;
		$scope.isAddDisabled = false;
		$scope.element = '_RoleHeading_';
		$scope.roleMove = false;
		$scope.displayElement = '';
		$scope.rootRole = false;
		$scope.editCurrentRole = false;

		$scope.$on('localizeResourcesUpdates', function () {
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

		$scope.addNewElement = function () {
			$scope.roleMove = false;
			$scope.editCurrentRole = false;

			$scope.isCollapsed = !$scope.isCollapsed;
			if ($scope.element == '_RoleHeading_') {
				$scope.elementResource.RootParentId = $scope.roleTree.currentNode.RootParentId;
				$scope.elementResource.ParentId = $scope.roleTree.currentNode.Id;
			}
		};

		//This not including role anymore should be split out
		$scope.editElement = function (row) {
			switch ($scope.element) {
				case '_RoleHeading_':
					$scope.elementResource.RootParentId = row.entity.RootParentId;
					$scope.elementResource.ParentId = row.entity.ParentId;
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
					$scope.isAddDisabled = true;
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
			authService.authorize(function () {
				$scope.canCreate = true;
			}, function () {
				$scope.canCreate = false;
			}, createPermissionRequired);
			authService.authorize(function () {
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
			if ($scope.rootRole) {
				$scope.elementResource.RootParentId = $scope.elementResource.Id;
			}
			if ($scope.elementResource.Id == undefined) {
				$scope.elementResource.$add(function () {
					$scope.toggleCollapse();
					getElementData();
				});
			} else {
				if ($scope.roleMove) {
					$scope.elementResource.ParentId = $scope.availableRoleSelected;
				}
				$scope.elementResource.$update(function () {
					$scope.toggleCollapse();
					getElementData();
				});
			}
		};

		$scope.cancelElementSave = function () {
			$scope.toggleCollapse();
			if ($scope.roleMove) {
				$scope.roleMove = false;
			} else {
				setNewResource();
			}
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
					$scope.subElementResource = new authAdminRoleDomainPermissionsResource();
					break;
				case '_DomainPermissionHeading_':
					$scope.subElementResource = new authAdminDomainPermissionFunctionalPermissionsResource();
					break;
				case '_FunctionalPermissionHeading_':
					$scope.subElementResource = new authAdmiFunctionalPermissionPermissionsResource();
					break;
				case '_PermissionHeading_':
					$scope.subElementResource = undefined;
					break;
			}
		}

		function setNewResource() {
			switch ($scope.element) {
				case '_RoleHeading_':
					$scope.elementResource = new authAdminRoleResource();
					break;
				case '_DomainPermissionHeading_':
					$scope.elementResource = new authAdminDomainPermissionResource();
					break;
				case '_FunctionalPermissionHeading_':
					$scope.elementResource = new authAdminFunctionalPermissionResource();
					break;
				case '_PermissionHeading_':
					$scope.elementResource = new authAdminPermissionResource();
					break;
			}
		}

		function fireSubSelection() {
			if ($scope.element != '_PermissionHeading_' && $scope.element != '_RoleHeading_' && $scope.selectedElement.length > 0) {
				setElementSubLists($scope.selectedElement[0].Id);
				$scope.hideSublevels = false;
			}

			if ($scope.element == '_RoleHeading_' && $scope.roleTree && angular.isObject($scope.roleTree.currentNode)) {
				setElementSubLists($scope.roleTree.currentNode.Id);
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
					$scope.isRole = true;
					$scope.isAddDisabled = true;
					authAdminRoleTreeResource.get({}, function (response) {
						$scope.roleListRaw = response;
						//roleList to treeview
						$scope.roleListMain = $scope.roleListRaw.TreeItems;
					},
				function (error) {
					console.log(error);
				});
					break;
				case '_DomainPermissionHeading_':
					$scope.isRole = false;
					$scope.isAddDisabled = false;
					authAdminDomainPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						selectFirst(result);
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_FunctionalPermissionHeading_':
					$scope.isRole = false;
					$scope.isAddDisabled = false;
					authAdminFunctionalPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
						selectFirst(result);
					}, function (err) { $scope.error = err; }
					);
					break;
				case '_PermissionHeading_':
					$scope.isRole = false;
					$scope.isAddDisabled = false;
					authAdminPermissionsResource.query({}, function (result) {
						$scope.elementDictionary = result;
					}, function (err) { $scope.error = err; }
					);
					break;
			}
		}

		//Treeview
		$scope.addRole = function (input) {
			console.log("add role to role with id: " + input.Id);
			$scope.addNewElement();
		};

		$scope.editRole = function (input) {
			console.log("edit role with id: " + input.Id);
			$scope.roleMove = false;
			$scope.editCurrentRole = true;
			authAdminRoleResource.get({ Id: input.Id }, function (response) {
				$scope.elementResource = response;
				$scope.rootRole = $scope.elementResource.Id == $scope.elementResource.RootParentId;
			},
			function (error) {
				console.log(error);
			});

			$scope.isCollapsed = true;
		};

		$scope.moveRole = function (input) {
			$scope.roleMove = true;
			$scope.editCurrentRole = false;
			console.log("move role with id: " + input.Id);
			authAdminRoleResource.get({ Id: input.Id }, function (response) {
				$scope.elementResource = response;
			},
			function (error) {
				console.log(error);
			});

			authAdminRolesRoleCanMoveToResource.get({ Id: input.Id }, function (response) {
				$scope.rolesAvailable = response;
				$scope.availableRoleSelected = $scope.rolesAvailable[1].Id;
			},
			function (error) {
				console.log(error);
			});
			$scope.isCollapsed = true;
		};

		$scope.deleteRole = function (input) {
			console.log("delete role with id: " + input.Id);
			var confirmed = confirm(localize.getLocalizedString('_DeleteConfirmMessage_'));
			if (confirmed) {
				authAdminRoleResource.remove({ Id: input.Id }, function(response) {
					$scope.elementResource = response;
					getElementData();
				},
					function(error) {
						console.log(error);
						getElementData();
					});
			}
		};

		$scope.$watch('roleTree.currentNode', function (newObj, oldObj) {
			if ($scope.roleTree && angular.isObject($scope.roleTree.currentNode)) {
				$scope.isAddDisabled = false;
				console.log('Node Selected!!');
				console.log($scope.roleTree.currentNode);
				fireSubSelection();
			}
		}, false);

	}]);

