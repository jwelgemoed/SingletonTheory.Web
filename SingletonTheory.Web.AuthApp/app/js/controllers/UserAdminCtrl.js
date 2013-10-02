'use strict';

userApplicationModule.controller('UserAdminCtrl',
	['$rootScope', '$scope', '$location', 'AuthService', 'UsersResource', 'UserResource', 'localize', 'AuthAdminRolesResource', 'AuthAdminDomainPermissionsResource', function ($rootScope, $scope, $location, authService, usersResource, userResource, localize, authAdminRolesResource, authAdminDomainPermissionsResource) {
		$scope.loading = true;
		$scope.isCollapsed = false;
		$scope.isDPCollapsed = false;
		
		$scope.activeFilterDescriptions = 'true'; //Set the default

		$scope.Language = 'nl-nl';
		$scope.userRole = '1';
	
		//Filters
		$scope.filterOptions = {
			filterText: '',
			useExternalFilter: false
		};

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
			$scope.loadRoles();
			$scope.dtStart = new Date();
			$scope.dtEnd = new Date();
			$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);
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

		//========== load roles ==========
		$scope.loadRoles = function () {
			authAdminRolesResource.get({}, function (response) {
				$scope.roles = response;
				$scope.userRole = $scope.roles[1].Id;
			});
		};

		$scope.editableInPopup = '<button type="button" class="btn btn-default" ng-click="editUser(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.userGridOptions = {
			data: 'users',
			filterOptions: $scope.filterOptions,
			showFilter: true,
			columnDefs: [{ field: 'UserName', displayName: localize.getLocalizedString('_UserNameHeading_') },
				{ field: 'Roles[0]', displayName: localize.getLocalizedString('_RoleHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				$scope.setContentArea();
			}
		};
		
		// ----------------------------------------------------------------------------
		// User edit area

		$scope.addUser = function () {
			$scope.isNew = true;
			$scope.isEdit = false;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new userResource();
			$scope.elementResource.Id = 0;
			$scope.elementResource.Active = true;
			$scope.elementResource.Language = $scope.Language;
			$scope.userRole = $scope.roles[1].Id;
			$scope.elementResource.Roles = [];
			$scope.elementResource.Roles.push($scope.userRole);

			$scope.toggleCollapse();
		};

		$scope.editUser = function (row) {
			$scope.isNew = false;
			$scope.isEdit = true;
			$scope.passwordIsRequired = false;

			$scope.elementResource = new userResource();

			userResource.get({ Id: row.entity.Id }, function (response) {

				$scope.elementResource = response;
				$scope.userRole = $scope.elementResource.Roles[0];
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isCollapsed = true;
		};

		$scope.addNewUser = function () {
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

		$scope.updateUser = function () {
			$scope.elementResource.Roles[0] = $scope.userRole;
			$scope.elementResource.$update(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelUserSave = function () {
			$scope.toggleCollapse();
			//setNewResource();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		//!-- content area ----------------------------------------------------
		// ----------------------------------------------------------------------------
		$scope.setContentArea = function () {
			//$scope.elementResource.Id
			$scope.GetDomainPermissions();
			//for (var i = 0; i < scope.elementResource.DomainPermissions.length; i++) {

			//}
		};

		$scope.editableDPInPopup = '<button type="button" class="btn btn-default" ng-click="editDP(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.dpGridOptions = {
			data: '$scope.elementResource.DomainPermissions',
			//filterOptions: $scope.filterOptions,
			//showFilter: true,
			columnDefs: [{ field: 'DomainPermissionId', displayName: localize.getLocalizedString('_DomainPermissionsHeading_') },
				{ field: 'StartDate', displayName: localize.getLocalizedString('_StartDateHeading_') },
				{ field: 'EndDate', displayName: localize.getLocalizedString('_EndDateHeading_') },
				 { displayName: '', cellTemplate: $scope.editableDPInPopup, width: 40 }],
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()]
		};

		$scope.GetDomainPermissions = function () {
			authAdminDomainPermissionsResource.get({}, function (response) {
				$scope.domainPermissions = response;
			});
		};


		$scope.addDP = function () {
			$scope.isDPNew = true;
			$scope.isDPEdit = false;

			//$scope.dpResource = new dpResource();
			//$scope.elementResource.Id = 0;
			//$scope.elementResource.Active = true;
			//$scope.elementResource.Language = $scope.Language;
			//$scope.userRole = $scope.roles[1].Id;
			//$scope.elementResource.Roles = [];
			//$scope.elementResource.Roles.push($scope.userRole);

			$scope.toggleDPCollapse();
		};
		
		$scope.toggleDPCollapse = function () {
			$scope.isDPCollapsed = !$scope.isDPCollapsed;
		};
		

		//DatePickers ----------
		
		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};
		
		$scope.openDtStart = function () {
			$timeout(function () {
				$scope.openedDtStart = true;
			});
		};
		
		$scope.openDtEnd = function () {
			$timeout(function () {
				$scope.openedDtEnd = true;
			});
		};
		
	}]);

