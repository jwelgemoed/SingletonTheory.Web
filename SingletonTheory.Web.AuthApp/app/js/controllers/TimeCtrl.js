angular.module('myApp.controllers', [])
	.controller('TimeCtrl', ['$scope', function ($scope) {
		$scope.format = 'M/d/yy h:mm:ss';
	}]);