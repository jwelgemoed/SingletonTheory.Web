'use strict';

angular.module('angular-client-side-auth')
	.controller('AdminCtrl',
	['$rootScope', '$scope', 'Users', 'Auth', function ($rootScope, $scope, Users, Auth) {
	    $scope.loading = true;
	    $scope.userRoles = Auth.userRoles;
	    
	    //********** init **********
	    $scope.init = function () {
	        wusers.refresh();
	    };

	    $scope.usersSearchQuery = '';
	    $scope.usersSearch = function (row) {
	       return !!((row.Id.toString().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
                row.UserName.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
                row.Roles[0].toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1));
	    };

	    //********** users **********
	    var wusers = {};
	    $scope.wusers = wusers;
	    //---------- properties ----------
	    $scope.regExNoNumbers = /^([^0-9]*)$/;
	    wusers.items = [];
	    //========== load ==========
	    wusers.refresh = function (callback) {
	        Users.getAll( function (res) {
	            wusers.items = [];
	            wusers.items = res;
	            $scope.loading = false;
	            if (callback) callback(wusers);
	        });
	    };

	    //Users.getAll(function (res) {
	    //    $scope.users = res;
	    //    $scope.loading = false;
	    //},
		//function (err) {
		//    $rootScope.error = "Failed to fetch users.";
		//    $scope.loading = false;
		//});

	    //********** addUserDialog **********
	    var addUserDialog = {};
	    $scope.addUserDialog = addUserDialog;
	    //---------- properties ----------
	    addUserDialog.userTemplate = {
	        UserName: '', Password: '', Roles: ''
	    };
	    
	    addUserDialog.mrole = "admin";

	    addUserDialog.options = {
	        mrole: ["admin", "user"]
	    };

	    addUserDialog.user = angular.copy(addUserDialog.userTemplate);
	    addUserDialog.errors = { userExists: false };
	    addUserDialog.visible = false;
	    //========== show ==========
	    addUserDialog.show = function (user, callback) {
	        addUserDialog.errors.service = null;
	        addUserDialog.mrole = "admin";
	        if (arguments.length === 1) {
	            addUserDialog.isNew = !(addUserDialog.isEdit = true);
	            addUserDialog.originalUser = user;
	            addUserDialog.user = angular.copy(user);
	            addUserDialog.mrole = user.Roles[0];
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
	            role: addUserDialog.mrole
	        },
            function () {
                addUserDialog.visible = false;
                wusers.refresh();
            },
            function (err) {
                addUserDialog.error = err;
            });
	    };

	    //========== update ==========
	    addUserDialog.update = function () {
	        Auth.register({
	            role: addUserDialog.mrole
	        },
            function () {
                addUserDialog.visible = false;
                wusers.refresh();
            },
            function (err) {
                addUserDialog.error = err;
            });
	    };
	}]);