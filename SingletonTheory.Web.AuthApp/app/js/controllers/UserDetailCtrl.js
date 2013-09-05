'use strict';

userApplicationModule.controller('UserDetailCtrl',
	['$rootScope', '$scope', '$routeParams', '$location', 'AuthService', 'UserResource', function ($rootScope, $scope, $routeParams, $location, authService, userResource) {

		$scope.isEdit = false;
		$scope.isNew = false;

		$scope.userRoles = authService.userRoles;

		$scope.activeFilterDescriptions = 'True';

		$scope.userTemplate = {
			Id: '', UserName: '', Password: '', Roles: '', Active: '', Language: ''
		};

		$scope.Meta = {
			Active: true,
			Language: 'en-US'
		};

		$scope.options = {
			role: ['admin', 'user']
		};

		$scope.role = $scope.options.role[1];
		$scope.userLanguage = 'en-US';
		$scope.user = angular.copy($scope.userTemplate);
		$scope.errors = { userExists: false };

		$scope.init = function (callback) {
			//	$scope.errors.service = null;
			$scope.isNew = !!($routeParams.Id == 0);
			$scope.isEdit = !!($routeParams.Id != 0);

			if ($scope.isEdit) {
				$scope.originalUser = $scope.user;
				$scope.user = userResource.get({ Id: $routeParams.Id }, function (response) {
					$scope.user = angular.copy(response[0]);
					$scope.role = $scope.user.Roles[0];
					$scope.Meta.Active = $scope.user.Meta.Active === 'True';
					$scope.Meta.Language = $scope.user.Meta.Language;
					$scope.userLanguage = $scope.user.Meta.Language;
				}
			);
			} else {
				$scope.user = angular.copy($scope.userTemplate);
				$scope.Meta.Active = true;
			}
			if (callback) callback();
		};

		$scope.save = function () {
			userResource.add({
				Id: 0,
				UserName: $scope.user.UserName,
				Password: $scope.user.Password,
				role: $scope.role,
				Active: $scope.Meta.Active,
				Language: $scope.Meta.Language
			},
			function () {
				$location.path('/users');
			},
			function (err) {
				$scope.error = err;
			});
		};

		$scope.update = function () {
			userResource.update({
				Id: $scope.user.Id,
				role: $scope.role,
				Active: $scope.Meta.Active,
				Language: $scope.Meta.Language
			},
			function () {
				$location.path('/users');
			},
			function (err) {
				$scope.error = err;
			});
		};

		$scope.cancel = function () {
			$location.path('/users');
		};
		
		$scope.validateUser = function (username, callback) {
			userResource.query({ UserName: username },
			function (result) {
				var userExists = result != undefined;
				$scope.errors.userExists = userExists;
				if (callback)
					callback(userExists);
			},
			function (err) {
				$scope.error = err;
			});
		};

		//========== validateUserForm ==========
		$scope.validateUserForm = function (invalid) {
			var x = invalid || $scope.errors.userExists;
			return x;
		};

	}]);