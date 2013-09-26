'use strict';

userApplicationModule.controller('UserAdminCtrl',
	['$rootScope', '$scope', '$location', 'AuthService', 'UsersResource', 'UserResource', 'localize', function ($rootScope, $scope, $location, authService, usersResource, userResource, localize) {
		$scope.loading = true;
		$scope.isCollapsed = false;

		$scope.userRoles = authService.userRoles;

		$scope.activeFilterDescriptions = 'true'; //Set the default

		$scope.Language = 'en-US';

		$scope.options = {
			role: ['admin', 'user']
		};


		//********** init **********
		$scope.init = function () {
			$scope.refresh();
		};


		//---------- properties ----------
		$scope.regExNoNumbers = /^([^0-9]*)$/;
		//========== load users ==========
		$scope.refresh = function () {
			usersResource.get({}, function (response) {
				$scope.users = response;

				$scope.loading = false;
			});
		};

		$scope.editableInPopup = '<button type="button" class="btn btn-default" ng-click="editElement(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.userGridOptions = {
			data: 'users',
			columnDefs: [{ field: 'UserName', displayName: localize.getLocalizedString('_UserNameHeading_') },
				{ field: 'Roles[0]', displayName: localize.getLocalizedString('_RoleHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
		};

		$scope.saveElement = function () {
			if ($scope.elementResource.Id == undefined) {
				if ($scope.elementResource.Active == '')
					$scope.elementResource.Active = true;

				$scope.elementResource.$add(function () {
					$scope.toggleCollapse();

				});
			} else {
				$scope.elementResource.$update(function () {
					$scope.toggleCollapse();
				});
			}
		};
		
		// User edit area


		$scope.cancelElementSave = function () {
			$scope.toggleCollapse();
			//setNewResource();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
		
		$scope.addElement = function () {
			$scope.isNew = true;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new userResource();
			$scope.elementResource.Active = true;
			$scope.elementResource.Language = $scope.Language;
			$scope.elementResource.Roles = [];
			$scope.elementResource.Roles.push($scope.options.role[1]);

			$scope.toggleCollapse();
		};

		$scope.editElement = function (row) {
			$scope.elementResource = row.entity;
			$scope.isEdit = true;
			$scope.passwordIsRequired = false;
			$scope.role = $scope.elementResource.Roles[0];
			
			$scope.isCollapsed = true;
		};

	}]);

