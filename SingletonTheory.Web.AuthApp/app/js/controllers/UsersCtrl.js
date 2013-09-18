'use strict';

userApplicationModule.controller('UsersCtrl',
	['$rootScope', '$scope', '$location', 'AuthService', 'UsersResource', function ($rootScope, $scope, $location, authService, usersResource) {
		$scope.loading = true;
		$scope.userRoles = authService.userRoles;

		$scope.activeFilterDescriptions = 'true'; //Set the default

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
		};

		$scope.activeFilter = function (row) {
			if ($scope.activeFilterDescriptions == '')
				return true;

			var value = JSON.parse($scope.activeFilterDescriptions);
			return !!(row.Active == value);
		};

		$scope.usersSearchQuery = '';
		$scope.usersSearch = function (row) {
			return !!((row.Id.toString().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.UserName.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.Roles[0].toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
						 row.Active == $scope.usersSearchQuery.toUpperCase() || 'true'));
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

		$scope.addNewUser = function () {
			$location.path('/users/0');
		};

		$scope.updateUser = function (id) {
			$location.path('/users/' + id);
		};
	}]);
	