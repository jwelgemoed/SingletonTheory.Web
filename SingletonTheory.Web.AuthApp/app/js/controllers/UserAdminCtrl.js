'use strict';

userApplicationModule.controller('UserAdminCtrl',
	['$rootScope', '$scope', '$location', 'AuthService', 'UsersResource', 'UserResource', 'localize', 'AuthAdminRolesResource', 'AuthAdminDomainPermissionsResource', function ($rootScope, $scope, $location, authService, usersResource, userResource, localize, authAdminRolesResource, authAdminDomainPermissionsResource) {

		$scope.loading = true;
		$scope.isCollapsed = false;
		$scope.isDPCollapsed = false;
		$scope.contentData = [];
		$scope.domainPermissions = [];
		$scope.domainPermissionsAvailable = [];
		
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
		};

		//---------- properties ----------
		$scope.regExNoNumbers = /^([^0-9]*)$/;
		//========== load users ==========
		$scope.refresh = function () {
			usersResource.get({}, function (response) {
				$scope.users = response;

				$scope.GetDomainPermissions();
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

				$scope.selectedUser = new userResource();

				userResource.get({ Id: data.entity.Id }, function (response) {
					$scope.selectedUser = response;
					var usedDomainPermissionIds = [];
					$scope.contentData.length = 0;
					
					//Set content grid data
					for (var i = 0; i < $scope.selectedUser.DomainPermissions.length; i++) {
						var dp = { DomainPermissionId: $scope.selectedUser.DomainPermissions[i].DomainPermissionId, Label: getDomainPermissionLabel($scope.selectedUser.DomainPermissions[i].DomainPermissionId), StartDate: $scope.parseJsonDateValue($scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.StartDate), EndDate: $scope.parseJsonDateValue($scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.EndDate) };
						$scope.contentData.push(dp);
						usedDomainPermissionIds.push($scope.selectedUser.DomainPermissions[i].DomainPermissionId);
					}
					
					//Set available domain permisions for combo
					$scope.domainPermissionsAvailable.length = 0;
					for (var j = 0; j < $scope.domainPermissions.length - 1; j++) {
						var id = $scope.domainPermissions[j].Id;
						if (!contains(usedDomainPermissionIds, id)) {
							$scope.domainPermissionsAvailable.push($scope.domainPermissions[j]);
						}
					}
				},
				function (error) {
					$scope.error = error;
				});
			}
		};

		var contains = function(a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return true;
				}
			}
			return false;
		};
		
		var getDomainPermissionLabel = function(domainPermissionId) {
			for (var i = 0; i < $scope.domainPermissions.length; i++) {
				if ($scope.domainPermissions[i].Id == domainPermissionId) {
					return $scope.domainPermissions[i].Label;
				}
			}
			return "NotSet";
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

			$scope.dtStart = new Date();
			$scope.dtEnd = new Date();
			$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);

		};

		$scope.editableDPInPopup = '<button type="button" class="btn btn-default" ng-click="editDP(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.dpGridOptions = {
			data: 'contentData',
			//filterOptions: $scope.filterOptions,
			//showFilter: true,
			columnDefs: [{ field: 'Label', displayName: localize.getLocalizedString('_DomainPermissionsHeading_') },
				{ field: 'StartDate', displayName: localize.getLocalizedString('_StartDateHeading_') },
				{ field: 'EndDate', displayName: localize.getLocalizedString('_EndDateHeading_') },
				 { displayName: '', cellTemplate: $scope.editableDPInPopup, width: 40 }],
			selectedItems: $scope.selectedDPElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()]
		};

		$scope.parseJsonDateValue = function (dateValue) {
			return new Date(parseInt(dateValue.substr(6)));
		};
		
		$scope.GetDomainPermissions = function () {
			authAdminDomainPermissionsResource.get({}, function (response) {
				$scope.domainPermissions = response;
				$scope.domainPermissionSelectedId = $scope.domainPermissions[0].Id;
			});
		};


		$scope.addDP = function () {
			$scope.isDPNew = true;
			$scope.isDPEdit = false;

			$scope.dtStart = new Date();
			$scope.dtEnd = new Date();
			$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);

			$scope.toggleDPCollapse();
		};

		$scope.editDP = function (row) {
			$scope.isDPNew = false;
			$scope.isDPEdit = true;
			
			$scope.domainPermissionSelectedId = row.entity.DomainPermissionId;

			$scope.dtStart = $scope.parseJsonDateValue(row.entity.ActiveTimeSpan.StartDate);
			$scope.dtEnd = $scope.parseJsonDateValue(row.entity.ActiveTimeSpan.EndDate);
			//$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);

			$scope.isDPCollapsed = true;
		};

		$scope.saveDP = function () {
			if ($scope.isDPNew) {
				$scope.dpo = {};
				$scope.dpo.DomainPermissionId = $scope.domainPermissionSelectedId;
				$scope.dpo.ActiveTimeSpan = {};
				$scope.dpo.ActiveTimeSpan.StartDate = $scope.dtStart;
				$scope.dpo.ActiveTimeSpan.EndDate = $scope.dtEnd;

				$scope.selectedUser.DomainPermissions.push($scope.dpo);
			}

			$scope.selectedUser.$update(function () {
				$scope.toggleDPCollapse();
				$scope.GetDomainPermissions();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.toggleDPCollapse = function () {
			$scope.isDPCollapsed = !$scope.isDPCollapsed;
		};

		$scope.cancelDPSave = function () {
			$scope.toggleDPCollapse();
			//setNewResource();
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

