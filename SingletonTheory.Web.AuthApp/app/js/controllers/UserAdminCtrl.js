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
		
		//Filters
		$scope.filterOptions = {
			filterText: '',
			useExternalFilter: false
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

		$scope.elementGridOptions = {
			data: 'users',
			filterOptions: $scope.filterOptions,
			showFilter: true,
			columnDefs: [{ field: 'UserName', displayName: localize.getLocalizedString('_UserNameHeading_') },
				{ field: 'Roles[0]', displayName: localize.getLocalizedString('_RoleHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()]
		};

		// User edit area

		$scope.addElement = function () {
			$scope.isNew = true;
			$scope.isEdit = false;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new userResource();
			$scope.elementResource.Id = 0;
			$scope.elementResource.Active = true;
			$scope.elementResource.Language = $scope.Language;
			$scope.elementResource.Roles = [];
			$scope.elementResource.Roles.push($scope.options.role[1]);

			$scope.toggleCollapse();
		};

		$scope.editElement = function (row) {
			$scope.isNew = false;
			$scope.isEdit = true;
			$scope.passwordIsRequired = false;

			$scope.elementResource = new userResource();
			
			userResource.get({ Id: row.entity.Id }, function (response) {

				$scope.elementResource = response;
				$scope.role = $scope.elementResource.Roles[0];
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isCollapsed = true;
		};

		$scope.addNewElement = function () {
			if ($scope.elementResource.Active == '')
				$scope.elementResource.Active = true;

			$scope.elementResource.$add(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.updateElement = function () {

			$scope.elementResource.$update(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelElementSave = function () {
			$scope.toggleCollapse();
			//setNewResource();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};
	}]);

