'use strict';

angular.module('angular-client-side-auth')
	.controller('AdminCtrl',
	['$rootScope', '$scope', 'Users', 'Auth', function ($rootScope, $scope, Users, Auth) {
	    $scope.loading = true;
	    $scope.userRoles = Auth.userRoles;
	    Users.getAll(function (res) {
	        $scope.users = res;
	        $scope.loading = false;
	    },
		function (err) {
		    $rootScope.error = "Failed to fetch users.";
		    $scope.loading = false;
		});

	    $scope.Refresh(function (res) {
	        $scope.users = res;
	        $scope.loading = false;
	    },
        function (err) {
            $rootScope.error = "Failed to fetch users.";
            $scope.loading = false;
        });


	    //********** addUserDialog **********
	    var addUserDialog = {};
	    $scope.addUserDialog = addUserDialog;
	    //---------- properties ----------
	    addUserDialog.userTemplate = {
	        UserName: '', Password: '', Roles: ''
	    };

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
	        } else {
	            addUserDialog.isEdit = !(addUserDialog.isNew = true);
	            addUserDialog.user = angular.copy(addUserDialog.userTemplate);
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
	        Auth.register({
	            UserName: addUserDialog.user.UserName,
	            Password: addUserDialog.user.Password,
	            role: addUserDialog.user.role.title
	        },
            function () {
                addUserDialog.visible = false;
            },
            function (err) {
                addUserDialog.error = err;
            });
	    };

	    //========== update ==========
	    addUserDialog.update = function () {
	        Auth.register({
	            role: addUserDialog.user.role.title
	        },
            function () {
                addUserDialog.visible = false;
            },
            function (err) {
                addUserDialog.error = err;
            });
	    };
	}]);