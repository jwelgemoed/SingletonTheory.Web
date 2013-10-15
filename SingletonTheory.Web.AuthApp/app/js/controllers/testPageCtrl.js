'use strict';

userApplicationModule.controller('TestPageCtrl', ['$rootScope', '$scope', 'AuthAdminRolesResource', 'AuthAdminRoleResource', 'AuthAdminRoleTreeResource', 'localize', 'AuthService',
	function ($rootScope, $scope, authAdminRolesResource, authAdminRoleResource, authAdminRoleTreeResource, localize, authService) {

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
		};

		//========== refresh ==========
		$scope.refresh = function() {
			authAdminRoleTreeResource.get({ RootParentId: 8 }, function(response) {
				$scope.roleListRaw = response;
				//roleList to treeview
				$scope.roleListMain = $scope.roleListRaw.TreeItems;
			},
				function(error) {
					console.log(error);
				});
		};
		
		$scope.roleListMain2 = [{ "RootParentId": 8, "TreeItems": [{ "Id": 8, "Label": "Ops Direkteur", "Children": [{ "Id": 1, "Label": "Admin", "Children": [{ "Id": 2, "Label": "User", "Children": [] }] }, { "Id": 2, "Label": "User", "Children": [] }, { "Id": 3, "Label": "Tekenaar", "Children": [] }, { "Id": 4, "Label": "Engineering Manager", "Children": [] }, { "Id": 7, "Label": "SomeNewRole", "Children": [] }] }] }];
		//test tree model 2
		$scope.roleListMainx = [
        {
        	"roleName": "User", "roleId": "role1", "children": [
          { "roleName": "subUser1", "roleId": "role11", "collapsed": true, "children": [] },
          {
          	"roleName": "subUser2", "roleId": "role12", "collapsed": true, "children": [
            {
            	"roleName": "subUser2-1", "roleId": "role121", "children": [
              { "roleName": "subUser2-1-1", "roleId": "role1211", "children": [] },
              { "roleName": "subUser2-1-2", "roleId": "role1212", "children": [] }
            	]
            }
          	]
          }
        	]
        },

        {
        	"roleName": "Admin", "roleId": "role2", "children": [
          { "roleName": "subAdmin1", "roleId": "role11", "collapsed": true, "children": [] },
          {
          	"roleName": "subAdmin2", "roleId": "role12", "children": [
            {
            	"roleName": "subAdmin2-1", "roleId": "role121", "children": [
              { "roleName": "subAdmin2-1-1", "roleId": "role1211", "children": [] },
              { "roleName": "subAdmin2-1-2", "roleId": "role1212", "children": [] }
            	]
            }
          	]
          }
        	]
        },

        {
        	"roleName": "Guest", "roleId": "role3", "children": [
          { "roleName": "subGuest1", "roleId": "role11", "children": [] },
          {
          	"roleName": "subGuest2", "roleId": "role12", "collapsed": true, "children": [
            {
            	"roleName": "subGuest2-1", "roleId": "role121", "children": [
              { "roleName": "subGuest2-1-1", "roleId": "role1211", "children": [] },
              { "roleName": "subGuest2-1-2", "roleId": "role1212", "children": [] }
            	]
            }
          	]
          }
        	]
        }
		];

		$scope.addRole = function (input) {
			console.log("add role to role with id: " + input.Id);
		};

		$scope.editRole = function (input) {
			console.log("edit role with id: " + input.Id);
		};

		$scope.moveRole = function (input) {
			console.log("move role with id: " + input.Id);
		};

		$scope.deleteRole = function (input) {
			console.log("delete role with id: " + input.Id);
		};

		$scope.$watch('roleTree1.currentNode', function (newObj, oldObj) {
			if ($scope.roleTree1 && angular.isObject($scope.roleTree1.currentNode)) {
				console.log('Node Selected!!');
				console.log($scope.roleTree1.currentNode);
			}
		}, false);

	}]);

