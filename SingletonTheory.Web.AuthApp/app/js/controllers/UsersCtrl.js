'use strict';

userApplicationModule.controller('UsersCtrl',
	['$rootScope', '$scope', 'Users', 'Auth', function ($rootScope, $scope, Users, Auth) {
	    $scope.loading = true;
	    $scope.userRoles = Auth.userRoles;

	    $scope.options = {
	        activeFilterDescriptions: [{ "value": "", "text": "All Users" }, { "value": "True", "text": "Active Users" }, { "value": "False", "text": "In-Active Users" }]
	    };

	    $scope.activeFilterDescriptions = $scope.options.activeFilterDescriptions[1]; //Set the default
	    
	    //********** init **********
	    $scope.init = function () {
	        wusers.refresh();
	    };
        
	    $scope.activeFilter = function (row) {
	           
	        return !!((row.Meta.Active.toUpperCase().indexOf($scope.activeFilterDescriptions.value.toUpperCase() || '') !== -1));
	    };
	    
	    $scope.usersSearchQuery = '';
	    $scope.usersSearch = function (row) {
	       return !!((row.Id.toString().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
                row.UserName.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
                row.Roles[0].toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1 ||
                row.Meta.Active.toUpperCase().indexOf($scope.usersSearchQuery.toUpperCase() || '') !== -1));
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

	    //********** addUserDialog **********
	    var addUserDialog = {};
	    $scope.addUserDialog = addUserDialog;
	    //---------- properties ----------
        addUserDialog.userTemplate = {
	       Id: '', UserName: '', Password: '', Roles: '', Active: ''
	    };
	    
	    addUserDialog.Meta = {
	        Active: true
	    };
	    
	    addUserDialog.options = {
	        mrole: ["admin", "user"]
	    };
	    
	    addUserDialog.mrole = addUserDialog.options.mrole[0];//Set the default

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
	            addUserDialog.Meta.Active = user.Meta.Active === "True";
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
	        Auth.addUser({
                Id: 0,
	            UserName: addUserDialog.user.UserName,
	            Password: addUserDialog.user.Password,
	            role: addUserDialog.mrole,
	            Active: addUserDialog.Meta.Active
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
	        Auth.updateUser({
	            Id: addUserDialog.user.Id,
	            role: addUserDialog.mrole,
	            Active: addUserDialog.Meta.Active
	        },
            function () {
                addUserDialog.visible = false;
                wusers.refresh();
            },
            function (err) {
                addUserDialog.error = err;
            });
	    };
	    
	    //========== userNameExists ==========
	    addUserDialog.validateUser = function (username, callback) {
	        Auth.userExist({
	            UserName: username
	        }, function (result) {
	            addUserDialog.errors.userExists = result;
	            if (callback) callback(result);
	        }, function (err) {
	            addUserDialog.error = err;
	        });
	    };
	    
	    //========== validateUserForm ==========
	    addUserDialog.validateUserForm = function (invalid) {
	        var x = invalid || addUserDialog.errors.userExists;
	        return x;
	    };
	}]);