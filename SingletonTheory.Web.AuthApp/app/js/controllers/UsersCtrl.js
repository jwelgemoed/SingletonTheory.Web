'use strict';

userApplicationModule.controller('UsersCtrl',
	['$rootScope', '$scope', 'UserService', 'AuthService', 'UserResource', function ($rootScope, $scope, userService, authService, userResource) {
		$scope.loading = true;
		$scope.userRoles = authService.userRoles;

		$scope.activeFilterDescriptions = 'True'; //Set the default

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
		};

		$scope.activeFilter = function (row) {
			return !!((row.Meta.Active.toUpperCase().indexOf($scope.activeFilterDescriptions.toUpperCase() || '') !== -1));
		};

		$scope.usersSearchQuery = '';
		$scope.usersSearch = function (row) {
			return !!((row.Id.toString().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.UserName.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.Roles[0].toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.Meta.Active.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1));
		};

		//---------- properties ----------
		$scope.regExNoNumbers = /^([^0-9]*)$/;
		//========== load users ==========
		$scope.refresh = function () {
			userResource.query({}, function (response) {
				$scope.users = response;
				userResource.get({ Id: 77 });
				userResource.query({ Id: 77 });

				userResource.get({ UserName: 'user' });
				userResource.query({ UserName: 'user' });
				$scope.loading = false;
			});
		};

		//********** addUserDialog **********
		var addUserDialog = {};
		$scope.addUserDialog = addUserDialog;
		//---------- properties ----------
		addUserDialog.userTemplate = {
			Id: '', UserName: '', Password: '', Roles: '', Active: '', Language: ''
		};

		addUserDialog.Meta = {
			Active: true,
			Language: 'en-US'
		};

		addUserDialog.options = {
			role: ['admin', 'user']
		};

		addUserDialog.role = addUserDialog.options.role[1];//Set the default
		addUserDialog.userLanguage = 'en-US';

		addUserDialog.user = angular.copy(addUserDialog.userTemplate);
		addUserDialog.errors = { userExists: false };
		addUserDialog.visible = false;
		//========== show ==========
		addUserDialog.show = function (user, callback) {
			addUserDialog.errors.service = null;

			if (arguments.length === 1) {
				addUserDialog.isNew = !(addUserDialog.isEdit = true);
				addUserDialog.originalUser = user;
				addUserDialog.user = angular.copy(user);
				addUserDialog.role = user.Roles[0];
				addUserDialog.Meta.Active = user.Meta.Active === 'True';
				addUserDialog.Meta.Language = user.Meta.Language;
			} else {
				addUserDialog.isEdit = !(addUserDialog.isNew = true);
				addUserDialog.user = angular.copy(addUserDialog.userTemplate);
				addUserDialog.Meta.Active = true;
			}

			addUserDialog.visible = true;
			if (callback) callback();
		};

		//========== hide ==========
		addUserDialog.hide = function () {
			addUserDialog.errors.problem = false;
			addUserDialog.visible = false;
		};

		//========== save ==========  
		addUserDialog.save = function () {
			userResource.save({
				Id: 0,
				UserName: addUserDialog.user.UserName,
				Password: addUserDialog.user.Password,
				role: addUserDialog.role,
				Active: addUserDialog.Meta.Active,
				Language: addUserDialog.Meta.Language
			},
			function () {
				addUserDialog.visible = false;
				$scope.refresh();
			},
			function (err) {
				addUserDialog.error = err;
			});
		};

		//========== update ==========
		addUserDialog.update = function () {
			userResource.save({
				Id: addUserDialog.user.Id,
				role: addUserDialog.role,
				Active: addUserDialog.Meta.Active,
				Language: addUserDialog.Meta.Language
			},
			function () {
				addUserDialog.visible = false;
				$scope.refresh();
			},
			function (err) {
				addUserDialog.error = err;
			});
		};

		//========== userNameExists ==========
		addUserDialog.validateUser = function (username, callback) {
			userResource.query({ UserName: username },
			function (result) {
				var userExists = result != undefined;
				addUserDialog.errors.userExists = userExists;
				if (callback)
					callback(userExists);
			},
			function (err) {
				addUserDialog.error = err;
			});
		};

		//========== validateUserForm ==========
		addUserDialog.validateUserForm = function (invalid) {
			var x = invalid || addUserDialog.errors.userExists;
			return x;
		};
	}]);