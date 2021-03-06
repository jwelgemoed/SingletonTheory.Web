﻿'use strict';

userApplicationModule.controller('UserAdminCtrl',
	['$rootScope', '$scope', '$location','$timeout', 'AuthService', 'UsersResource', 'UserResource', 'localize', 'AuthAdminRolesResource', 'AuthAdminDomainPermissionsResource', 'AuthService', function ($rootScope, $scope, $location,$timeout, authService, usersResource, userResource, localize, authAdminRolesResource, authAdminDomainPermissionsResource, AuthService) {

		//info
		$scope.loading = true;
		$scope.isCollapsed = false;
		$scope.activeFilterDescriptions = 'true'; //Set the default
		$scope.Language = 'nl-nl';
		$scope.userRole = '1';
		$scope.canCreateUser = false;
		$scope.canUpdateUser = false;
		$scope.canCreateDomainPermissionLink = false;
		$scope.canUpdateDomainPermissionLink = false;


		//Content area
		$scope.isDPCollapsed = false;
		$scope.contentData = [];
		$scope.domainPermissions = [];
		$scope.domainPermissionsAvailable = [];
		$scope.usedDomainPermissionIds = [];
		$scope.isDPNew = false;
		$scope.isDPEdit = false;
		$scope.useEndDate = true;
		$scope.maxDate = new Date("June 1, 2045");
		$scope.dateFormat = "dd-MMMM-yyyy";
		$scope.isAddDomainPermissionsDisabled = true;

		// ************************ INFO AREA ************************************************************************
		//Filters
		$scope.filterOptions = {
			filterText: '',
			useExternalFilter: false
		};

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
			setCreateUpdate();
			$scope.loadRoles();
		};

		//========== refresh ==========
		$scope.refresh = function () {
			usersResource.get({}, function (response) {
				$scope.users = response;
				$scope.loadDomainPermissions();
				$scope.loading = false;
			});
		};

		function setCreateUpdate() {
			AuthService.authorize(function () {
				$scope.canCreateUser = true;
			}, function () {
				$scope.canCreateUser = false;
			}, 'UserAdministrationUser_Create');
			AuthService.authorize(function () {
				$scope.canUpdateUser = true;
			}, function () {
				$scope.canUpdateUser = false;
			}, 'UserAdministrationUser_Update');
			AuthService.authorize(function () {
				$scope.canCreateDomainPermissionLink = true;
			}, function () {
				$scope.canCreateDomainPermissionLink = false;
			}, 'UserAdministrationDomainPermissionLink_Create');
			AuthService.authorize(function () {
				$scope.canUpdateDomainPermissionLink = true;
			}, function () {
				$scope.canUpdateDomainPermissionLink = false;
			}, 'UserAdministrationDomainPermissionLink_Update');
		}

		//========== load roles ==========
		$scope.loadRoles = function () {
			authAdminRolesResource.get({}, function (response) {
				$scope.roles = response;
				$scope.userRole = $scope.roles[1].Id;
			});
		};

		//========== load domain permissions ==========
		$scope.loadDomainPermissions = function () {
			authAdminDomainPermissionsResource.get({}, function (response) {
				$scope.domainPermissions = response;
				$scope.domainPermissionSelectedId = $scope.domainPermissions[0].Id;
			});
		};

		// ******** info area grid *************************
		$scope.editableInPopup = '<button type="button" ng-disabled="!canUpdateUser"  class="btn btn-default" ng-click="editUser(row)"><i class="icon-edit icon-black"></i></button> ';
		$scope.lastRowId = 0;
		$scope.mainColumnDefs = [{ field: 'UserName', displayName: localize.getLocalizedString('_UserNameHeading_') },
				{ field: 'Roles[0]', displayName: localize.getLocalizedString('_RoleHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];

		$scope.domainPermissionsColumnDefs = [{ field: 'Label', displayName: localize.getLocalizedString('_DomainPermissionHeading_') },
			{ field: 'StartDate', displayName: localize.getLocalizedString('_StartDateHeading_') },
			{ field: 'EndDate', displayName: localize.getLocalizedString('_EndDateHeading_') },
			{ displayName: '', cellTemplate: $scope.editableDPInPopup, width: 40 }];

		$scope.$on('localizeResourcesUpdates', function () {
			$scope.mainColumnDefs = [{ field: 'UserName', displayName: localize.getLocalizedString('_UserNameHeading_') },
				{ field: 'Roles[0]', displayName: localize.getLocalizedString('_RoleHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
			$scope.domainPermissionsColumnDefs = [{ field: 'Label', displayName: localize.getLocalizedString('_DomainPermissionHeading_') },
			{ field: 'StartDate', displayName: localize.getLocalizedString('_StartDateHeading_') },
			{ field: 'EndDate', displayName: localize.getLocalizedString('_EndDateHeading_') },
			{ displayName: '', cellTemplate: $scope.editableDPInPopup, width: 40 }];
		});

		$scope.userGridOptions = {
			data: 'users',
			filterOptions: $scope.filterOptions,
			showFilter: true,
			columnDefs: 'mainColumnDefs',
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				//NOTE : This event is called twice once to select and then to decelect
				if (data.entity.Id != $scope.lastRowId) {
					$scope.setContentArea();
					refreshSetSelectedUser(data.entity.Id);
					$scope.lastRowId = data.entity.Id;
				}
			}
		};

		var refreshSetSelectedUser = function (userId) {
			$scope.selectedUser = new userResource();
			$scope.contentData.length = 0;
			userResource.get({ Id: userId }, function (response) {
				$scope.selectedUser = response;
				//Set content grid data
				setContentGridData();
				//Set available domain permisions for combo
				setAvailableDomainPermissions(-1);
			},
				function (error) {
					$scope.error = error;
				});
		};

		var setContentGridData = function () {
			$scope.usedDomainPermissionIds.length = 0;
			for (var i = 0; i < $scope.selectedUser.DomainPermissions.length; i++) {
				var id = $scope.selectedUser.DomainPermissions[i].DomainPermissionId;
				var label = getDomainPermissionLabel($scope.selectedUser.DomainPermissions[i].DomainPermissionId);
				var startDate = $scope.parseJsonDateValue($scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.StartDate);
				var endDate = $scope.parseJsonDateValue($scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.EndDate);
				var dp = { DomainPermissionId: id, Label: label, StartDate: startDate, EndDate: endDate };
				$scope.contentData.push(dp);
				$scope.usedDomainPermissionIds.push($scope.selectedUser.DomainPermissions[i].DomainPermissionId);
			}
		};

		var getDomainPermissionLabel = function (domainPermissionId) {
			for (var i = 0; i < $scope.domainPermissions.length; i++) {
				if ($scope.domainPermissions[i].Id == domainPermissionId) {
					return $scope.domainPermissions[i].Label;
				}
			}
			return "NotSet";
		};

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

		$scope.saveNewUser = function () {
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

		$scope.saveUser = function () {
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
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// ************************ END INFO AREA *************************************
		// ----------------------------------------------------------------------------
		// ************************ CONTENT AREA **************************************

		$scope.setContentArea = function () {

			$scope.dtStart = new Date();
			$scope.dtEnd = new Date();
			$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);

		};

		$scope.editableDPInPopup = '<button type="button" ng-disabled="!canUpdateDomainPermissionLink"   class="btn btn-default" ng-click="editDP(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.dpGridOptions = {
			data: 'contentData',
			columnDefs: 'domainPermissionsColumnDefs',
			selectedItems: $scope.selectedDPElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {

			}
		};

		$scope.addDP = function () {
			$scope.isDPNew = true;
			$scope.isDPEdit = false;
			setAvailableDomainPermissions(-1);
			$scope.dtStart = new Date();
			$scope.dtEnd = new Date();
			$scope.dtEnd.setDate($scope.dtStart.getDate() + 5);
			$scope.toggleDPCollapse();
		};

		$scope.editDP = function (row) {
			$scope.isDPNew = false;
			$scope.isDPEdit = true;
			$scope.domainPermissionSelectedId = row.entity.DomainPermissionId;
			$scope.dtStart = row.entity.StartDate;
			$scope.dtEnd = row.entity.EndDate;
			setAvailableDomainPermissions(row.entity.DomainPermissionId);
			$scope.isDPCollapsed = true;
		};

		var setAvailableDomainPermissions = function (domainPermissionId) {
			$scope.domainPermissionsAvailable.length = 0;
			var usedIds = $scope.usedDomainPermissionIds;
			remove(usedIds, domainPermissionId);

			for (var j = 0; j < $scope.domainPermissions.length - 1; j++) {
				var id = $scope.domainPermissions[j].Id;
				if (!contains(usedIds, id)) {
					$scope.domainPermissionsAvailable.push($scope.domainPermissions[j]);
				}
			}
			$scope.domainPermissionSelectedId = $scope.domainPermissionsAvailable[0].Id;
			$scope.isAddDomainPermissionsDisabled = !($scope.domainPermissionsAvailable.length > 0);
		};

		$scope.saveDP = function () {
			if ($scope.isDPNew) {
				$scope.dpo = {};
				$scope.dpo.DomainPermissionId = $scope.domainPermissionSelectedId;
				$scope.dpo.ActiveTimeSpan = {};
				$scope.dpo.ActiveTimeSpan.StartDate = $scope.dtStart;
				if ($scope.useEndDate) {
					$scope.dpo.ActiveTimeSpan.EndDate = $scope.dtEnd;
				}

				if (!$scope.selectedUser.DomainPermissions) {
					$scope.selectedUser.DomainPermissions = [];
				}

				$scope.selectedUser.DomainPermissions.push($scope.dpo);
			} else {
				for (var i = 0; i < $scope.selectedUser.DomainPermissions.length; i++) {

					if ($scope.selectedUser.DomainPermissions[i].DomainPermissionId == $scope.domainPermissionSelectedId) {
						alert("setting date values ");

						if (!$scope.useEndDate) {
							$scope.dtEnd = $scope.maxDate;
						}

						$scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.StartDate = $scope.dtStart;
						$scope.selectedUser.DomainPermissions[i].ActiveTimeSpan.EndDate = $scope.dtEnd;
					}
				}
			}

			$scope.contentData.length = 0;

			$scope.selectedUser.$update(function () {
				$scope.toggleDPCollapse();

				//Set content grid data
				setContentGridData();
				//Set available domain permisions for combo
				setAvailableDomainPermissions(-1);
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
			if ($scope.useEndDate) {
				$timeout(function () {
					$scope.openedDtEnd = true;
				});
			}
		};

		// ************************ CONTENT AREA **************************************

		// TODO: Add to seperate library

		$scope.parseJsonDateValue = function (dateValue) {
			return new Date(parseInt(dateValue.substr(6))).toString($scope.dateFormat);
		};


		var contains = function (a, obj) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === obj) {
					return true;
				}
			}
			return false;
		};

		var remove = function (arr, item) {
			for (var i = arr.length; i--;) {
				if (arr[i] === item) {
					arr.splice(i, 1);
				}
			}
		};

	}]);

