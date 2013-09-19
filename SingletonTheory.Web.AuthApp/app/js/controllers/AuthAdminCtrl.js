'use strict';

userApplicationModule.controller('AuthAdminCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminDomainPermissionsResource',
	'AuthAdminFunctionalPermissionsResource', 'AuthAdminPermissionsResource', 'AuthAdminRoleDomainPermissionsResource', 'AuthAdminDomainPermissionFunctionalPermissionsResource',
	'AuthAdmiFunctionalPermissionPermissionsResource',
	function ($rootScope, $scope, AuthAdminRolesResource, AuthAdminDomainPermissionsResource, AuthAdminFunctionalPermissionsResource,
		AuthAdminPermissionsResource, AuthAdminRoleDomainPermissionsResource, AuthAdminDomainPermissionFunctionalPermissionsResource,
		AuthAdmiFunctionalPermissionPermissionsResource) {

		$scope.element = 'Role';

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
			columnDefs: [{ field: 'Label', displayName: 'Name' }],
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
			columnDefs: [{ field: 'Label', displayName: 'Name' }],
			selectedItems: $scope.selectedAssigned,
			multiSelect: true
		};
		
		$scope.unAssignedGridOptions = {
			data: 'subElements.UnAssigned',
			columnDefs: [{ field: 'Label', displayName: 'Name' }],
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
			$scope.subElements = [];
			$scope.hideSublevels = true;
			getElementData();
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
				case 'Functional Permissions':
					AuthAdmiFunctionalPermissionPermissionsResource.get({ Id: id }, function (result) {
						$scope.subElements = result;
						$scope.AssignedHeader = 'Assigned Permissions';
						$scope.UnAssignedHeader = 'Available Permissions';
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
			}
		};

		function getElementData () {
			switch ($scope.element) {
				case 'Role':
					AuthAdminRolesResource.query({}, function (result) {
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
				case 'Domain Permissions':
					AuthAdminDomainPermissionsResource.query({}, function (result) {
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

