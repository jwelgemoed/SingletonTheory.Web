'use strict';

userApplicationModule.controller('RoleAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRoleResource', 'AuthAdminRoleDomainPermissionsResource',
	 'AuthAdminRoleTreeResource', 'AuthAdminRolesRoleCanMoveToResource', 'localize', 'AuthService',
	function ($rootScope, $scope, authAdminRoleResource, authAdminRoleDomainPermissionsResource,
		 authAdminRoleTreeResource, authAdminRolesRoleCanMoveToResource, localize, authService) {

		$scope.madeSubListChanges = true;
		$scope.isRole = true;
		$scope.isAddDisabled = false;
		$scope.roleMove = false;
		$scope.rootRole = false;
		$scope.editCurrentRole = false;
		$scope.isCollapsed = false;
		$scope.canCreate = false;
		$scope.canUpdate = false;
		$scope.selectedElement = [];
		$scope.selectedAssigned = [];
		$scope.selectedUnAssigned = [];
		$scope.error = '';
		$scope.elementDictionary = [];
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
			setReadWrite();
			$scope.hideSublevels = true;
			getElementData();
		};

		$scope.addNewElement = function () {
			$scope.roleMove = false;
			$scope.editCurrentRole = false;
			$scope.isCollapsed = !$scope.isCollapsed;
			$scope.elementResource.RootParentId = $scope.roleTree.currentNode.RootParentId;
			$scope.elementResource.ParentId = $scope.roleTree.currentNode.Id;
		};

		//This not including role anymore should be split out
		$scope.editElement = function (row) {
			$scope.elementResource.RootParentId = row.entity.RootParentId;
			$scope.elementResource.ParentId = row.entity.ParentId;
			$scope.isCollapsed = true;
		};

		$scope.saveSubElements = function () {
			if ($scope.subElementResource != undefined) {
				$scope.subElementResource.$update({ Id: $scope.subElementResource.RoleId }, function (result) {
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

		function setReadWrite() {
			authService.authorize(function () {
				$scope.canCreate = true;
			}, function () {
				$scope.canCreate = false;
			}, 'RoleAdministration_Create');
			authService.authorize(function () {
				$scope.canUpdate = true;
			}, function () {
				$scope.canUpdate = false;
			}, 'RoleAdministration_Update');
		}

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
			$scope.subElementResource.$get({ Id: id }, function (result) {
			}, function (err) { $scope.error = err; }
					);
		}

		function setNewSubElementResource() {
			$scope.subElementResource = new authAdminRoleDomainPermissionsResource();
		}

		function setNewResource() {
			$scope.elementResource = new authAdminRoleResource();
		}

		function fireSubSelection() {
			setElementSubLists($scope.roleTree.currentNode.Id);
			$scope.hideSublevels = false;
		};

		function getElementData() {
			setNewResource();
			setNewSubElementResource();
			$scope.isAddDisabled = true;
			authAdminRoleTreeResource.get({}, function (response) {
				$scope.roleListRaw = response;
				//roleList to treeview
				$scope.roleListMain = $scope.roleListRaw.TreeItems;
			},
		function (error) {
			console.log(error);
		});
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
				authAdminRoleResource.remove({ Id: input.Id }, function (response) {
					$scope.elementResource = response;
					getElementData();
				},
					function (error) {
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

