'use strict';

userApplicationModule.controller('FunctionalPermissionAdminCtrl', ['$rootScope', '$scope',
 'AuthAdminFunctionalPermissionsResource', 'AuthAdminFunctionalPermissionResource','AuthAdmiFunctionalPermissionPermissionsResource', 'localize', 'AuthService',
	function ($rootScope, $scope, 
		 authAdminFunctionalPermissionsResource, authAdminFunctionalPermissionResource,authAdmiFunctionalPermissionPermissionsResource, localize, authService) {

		$scope.madeSubListChanges = true;
		$scope.isAddDisabled = false;
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
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		//This not including role anymore should be split out
		$scope.editElement = function (row) {
			$scope.elementResource.Id = row.entity.Id;
			$scope.elementResource.Name = row.entity.Name;
			$scope.isCollapsed = true;
		};

		$scope.saveSubElements = function () {
			if ($scope.subElementResource != undefined) {
				$scope.subElementResource.$update({ Id: $scope.subElementResource.FunctionalPermissionId }, function (result) {
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
			}, 'FunctionalPermissionAdministration_Create');
			authService.authorize(function () {
				$scope.canUpdate = true;
			}, function () {
				$scope.canUpdate = false;
			}, 'FunctionalPermissionAdministration_Update');
		}

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
			$scope.subElementResource.$get({ Id: id }, function (result) {
			}, function (err) { $scope.error = err; }
					);
		}

		function setNewSubElementResource() {
			$scope.subElementResource = new authAdmiFunctionalPermissionPermissionsResource();
		}

		function setNewResource() {
			$scope.elementResource = new authAdminFunctionalPermissionResource();
		}

		function fireSubSelection() {
			if ($scope.selectedElement.length > 0) {
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
			$scope.isAddDisabled = false;
			authAdminFunctionalPermissionsResource.query({}, function (result) {
				$scope.elementDictionary = result;
				selectFirst(result);
			}, function (err) { $scope.error = err; }
			);
		}

	}]);

