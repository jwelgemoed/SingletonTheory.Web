'use strict';

userApplicationModule.controller('UserDetailCtrl',
	['$rootScope', '$scope', '$routeParams', '$location', 'AuthService', 'UserResource', function ($rootScope, $scope, $routeParams, $location, authService, userResource) {

		$scope.Language = 'en-US';
		$scope.errors = { userExists: false };
		$scope.options = {
			role: ['admin', 'user']
		};

		$scope.init = function (callback) {
			$scope.isNew = !!($routeParams.Id == 0);
			$scope.isEdit = !!($routeParams.Id != 0);

			if ($scope.isNew) {
				$scope.user = new userResource();
				$scope.user.Active = true;
				$scope.user.Roles = [];
				$scope.user.Roles.push($scope.options.role[1]);
			}
			else {
				userResource.get({ Id: $routeParams.Id }, function (response) {
					$scope.user = response;
					$scope.role = $scope.user.Roles[0];
				});
			}

			if (callback) callback();
		};

		$scope.updateRole = function () {
			$scope.user.Roles = [];
			$scope.user.Roles.push($scope.role);
		}

		$scope.save = function () {
			if ($scope.user.Active == '')
				$scope.user.Active = true;

			$scope.user.$add(function () {
				$location.path('/users');
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.update = function () {
			$scope.user.$update(function () {
				$location.path('/users');
			},
			function (error) {
				$scope.error = error;
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