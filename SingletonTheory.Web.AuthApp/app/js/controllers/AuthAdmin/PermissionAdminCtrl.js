'use strict';

userApplicationModule.controller('PermissionAdminCtrl', ['$rootScope', '$scope', 'AuthAdminPermissionsResource',
	'AuthAdminPermissionResource','localize', 'AuthService',
	function ($rootScope, $scope, authAdminPermissionsResource, authAdminPermissionResource, localize, authService) {

		$scope.isAddDisabled = false;
		$scope.isCollapsed = false;
		$scope.canCreate = false;
		$scope.canUpdate = false;
		$scope.selectedElement = [];
		$scope.error = '';
		$scope.elementDictionary = [];

		$scope.editableInPopup = '<button type="button" ng-disabled="!canUpdate" class="btn btn-default" ng-click="editElement(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.sortHeading = localize.getLocalizedString('_SortHeading_');

		$scope.mainColumnDefs = [{ field: 'Label', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];

		$scope.$on('localizeResourcesUpdates', function () {
			$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
			$scope.mainColumnDefs = [{ field: 'Label', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
		});

		$scope.elementGridOptions = {
			data: 'elementDictionary',
			columnDefs: 'mainColumnDefs',
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin(), new ngGridLayoutPlugin()]
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

		function setReadWrite() {
			authService.authorize(function () {
				$scope.canCreate = true;
			}, function () {
				$scope.canCreate = false;
			}, 'PermissionAdministration_Create');
			authService.authorize(function () {
				$scope.canUpdate = true;
			}, function () {
				$scope.canUpdate = false;
			}, 'PermissionAdministration_Update');
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

		function removeElementFromArray(elementArray, elementToRemove) {
			for (var i = elementArray.length - 1; i >= 0; i--) {
				if (elementArray[i].Id === elementToRemove.Id) {
					elementArray.splice(i, 1);
				}
			}
		};

		function setNewResource() {
			$scope.elementResource = new authAdminPermissionResource();
		}

		function getElementData() {
			setNewResource();
			$scope.isAddDisabled = false;
			authAdminPermissionsResource.query({}, function (result) {
				$scope.elementDictionary = result;
			}, function (err) { $scope.error = err; }
			);
		}

	}]);

