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

		var cssStyleCurrent = "height:100%; width:100%;";
		var cssStyleAreaChartCurrent = "height:100%; width:100%;";
		$scope.areaChartSpan = "span4";
		$scope.chartSpan = "span4";
		
		$scope.fullScreen = function() {
			$scope.chartSpan = "span12";
		};
		
		$scope.resizeSmall = function () {
			$scope.chartSpan = "span4";
		};
		
		$scope.fullScreenAreaChart = function () {
			$scope.areaChartSpan = "span12";
		};

		$scope.resizeSmallAreaChart = function () {
			$scope.areaChartSpan = "span4";
		};

		$scope.chart = {
			type: "PieChart",
			displayed: true,
			cssStyle: cssStyleCurrent,
			data: {
				"cols": [
					{
						"id": "month",
						"label": "Month",
						"type": "string"
					},
					{
						"id": "laptop-id",
						"label": "Laptop",
						"type": "number"
					},
					{
						"id": "desktop-id",
						"label": "Desktop",
						"type": "number"
					},
					{
						"id": "server-id",
						"label": "Server",
						"type": "number"
					},
					{
						"id": "cost-id",
						"label": "Shipping",
						"type": "number"
					}
				],
				"rows": [
					{
						"c": [
							{
								"v": "January"
							},
							{
								"v": 19,
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"80\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_w.png\" height=\"12\" width=\"20\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 42 items</span> ",
								"p": {
									"className": "google-visualization-formatters-arrow-empty",
									"_bar_format_old_value": "42 items"
								}
							},
							{
								"v": 12,
								"f": "Ony 12 items"
							},
							{
								"v": 7,
								"f": "7 servers"
							},
							{
								"v": 4,
								"p": {
									"style": "color:white;background-color:#800080;"
								},
								"f": "$4,00"
							}
						]
					},
					{
						"c": [
							{
								"v": "February"
							},
							{
								"v": 13,
								"p": {
									"className": "google-visualization-formatters-arrow-dr",
									"_bar_format_old_value": "13"
								},
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"55\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_w.png\" height=\"12\" width=\"45\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 13</span> "
							},
							{
								"v": 1,
								"f": "1 unit (Out of stock this month)"
							},
							{
								"v": 12
							},
							{
								"v": 2,
								"p": {
									"style": "color:white;background-color:red;"
								},
								"f": "$2,00"
							}
						]
					},
					{
						"c": [
							{
								"v": "March"
							},
							{
								"v": 24,
								"p": {
									"className": "google-visualization-formatters-arrow-ug",
									"_bar_format_old_value": "24"
								},
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"100\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 24</span> "
							},
							{
								"v": 5
							},
							{
								"v": 11
							},
							{
								"v": 6,
								"p": {
									"style": "color:black;background-color:#33ff33;"
								},
								"f": "$6,00"
							}
						]
					}
				]
			},
			"options": {
				"title": "Sales per month",
				"isStacked": "true",
				"fill": 20,
				"displayExactValues": true,
				"vAxis": {
					"title": "Sales unit",
					"gridlines": {
						"count": 10
					}
				},
				"hAxis": {
					"title": "Date"
				},
				"allowHtml": true
			},
			"formatters": {
				"date": [
					{
						"columnNum": 5,
						"formatType": "long"
					}
				],
				"arrow": [
					{
						"columnNum": 1,
						"base": 19
					}
				],
				"color": [
					{
						"columnNum": 4,
						"formats": [
							{
								"from": 0,
								"to": 3,
								"color": "white",
								"bgcolor": "red"
							},
							{
								"from": 3,
								"to": 5,
								"color": "white",
								"fromBgColor": "red",
								"toBgColor": "blue"
							},
							{
								"from": 6,
								"to": null,
								"color": "black",
								"bgcolor": "#33ff33"
							}
						]
					}
				],
				"number": [
					{
						"columnNum": 4,
						"prefix": "$"
					}
				],
				"bar": [
					{
						"columnNum": 1,
						"width": 100
					}
				]
			}
		};
		
		$scope.areaChart = {
			type: "AreaChart",
			displayed: true,
			cssStyle: cssStyleAreaChartCurrent,
			data: {
				"cols": [
					{
						"id": "month",
						"label": "Month",
						"type": "string"
					},
					{
						"id": "laptop-id",
						"label": "Laptop",
						"type": "number"
					},
					{
						"id": "desktop-id",
						"label": "Desktop",
						"type": "number"
					},
					{
						"id": "server-id",
						"label": "Server",
						"type": "number"
					},
					{
						"id": "cost-id",
						"label": "Shipping",
						"type": "number"
					}
				],
				"rows": [
					{
						"c": [
							{
								"v": "January"
							},
							{
								"v": 19,
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"80\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_w.png\" height=\"12\" width=\"20\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 42 items</span> ",
								"p": {
									"className": "google-visualization-formatters-arrow-empty",
									"_bar_format_old_value": "42 items"
								}
							},
							{
								"v": 12,
								"f": "Ony 12 items"
							},
							{
								"v": 7,
								"f": "7 servers"
							},
							{
								"v": 4,
								"p": {
									"style": "color:white;background-color:#800080;"
								},
								"f": "$4,00"
							}
						]
					},
					{
						"c": [
							{
								"v": "February"
							},
							{
								"v": 13,
								"p": {
									"className": "google-visualization-formatters-arrow-dr",
									"_bar_format_old_value": "13"
								},
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"55\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_w.png\" height=\"12\" width=\"45\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 13</span> "
							},
							{
								"v": 1,
								"f": "1 unit (Out of stock this month)"
							},
							{
								"v": 12
							},
							{
								"v": 2,
								"p": {
									"style": "color:white;background-color:red;"
								},
								"f": "$2,00"
							}
						]
					},
					{
						"c": [
							{
								"v": "March"
							},
							{
								"v": 24,
								"p": {
									"className": "google-visualization-formatters-arrow-ug",
									"_bar_format_old_value": "24"
								},
								"f": "<span style=\"padding: 0; float: left; white-space: nowrap;\"><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_b.png\" height=\"12\" width=\"100\" /><img style=\"padding: 0\" src=\"http://ajax.googleapis.com/ajax/static/modules/gviz/1.0/util/bar_s.png\" height=\"12\" width=\"1\" /> 24</span> "
							},
							{
								"v": 5
							},
							{
								"v": 11
							},
							{
								"v": 6,
								"p": {
									"style": "color:black;background-color:#33ff33;"
								},
								"f": "$6,00"
							}
						]
					}
				]
			},
			"options": {
				"title": "Sales per month",
				"isStacked": "true",
				"fill": 20,
				"displayExactValues": true,
				"vAxis": {
					"title": "Sales unit",
					"gridlines": {
						"count": 10
					}
				},
				"hAxis": {
					"title": "Date"
				},
				"allowHtml": true
			},
			"formatters": {
				"date": [
					{
						"columnNum": 5,
						"formatType": "long"
					}
				],
				"arrow": [
					{
						"columnNum": 1,
						"base": 19
					}
				],
				"color": [
					{
						"columnNum": 4,
						"formats": [
							{
								"from": 0,
								"to": 3,
								"color": "white",
								"bgcolor": "red"
							},
							{
								"from": 3,
								"to": 5,
								"color": "white",
								"fromBgColor": "red",
								"toBgColor": "blue"
							},
							{
								"from": 6,
								"to": null,
								"color": "black",
								"bgcolor": "#33ff33"
							}
						]
					}
				],
				"number": [
					{
						"columnNum": 4,
						"prefix": "$"
					}
				],
				"bar": [
					{
						"columnNum": 1,
						"width": 100
					}
				]
			}
		};
		
	}]);

