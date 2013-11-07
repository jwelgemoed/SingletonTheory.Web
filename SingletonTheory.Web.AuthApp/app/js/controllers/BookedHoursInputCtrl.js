'use strict';

userApplicationModule.controller('BookedHoursInputCtrl',
	['$rootScope', '$scope', '$timeout', 'localize', 'AuthService', 'ItemHoursEntryResource', 'CostCentreResource', 'HourTypeResource',
		function ($rootScope, $scope, $timeout, localize, AuthService, ItemHoursEntryResource, CostCentreResource, HourTypeResource) {

			$scope.itemHoursResource = [];
			$scope.costCentres = [];
			$scope.hourTypes = [];
			$scope.bookedHourType = "";
			$scope.productionCostCentre = "";
			$scope.paintingCostCentre = "";

			$scope.init = function () {
				$scope.itemHoursResource = new ItemHoursEntryResource();
				
				CostCentreResource.query({}, function (result) {
					$scope.costCentres = result;
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "PROD" ) {
							$scope.productionCostCentre = result[i];
						}
						if (result[i].LookupCode == "PNTG") {
							$scope.paintingCostCentre = result[i];
						}
					}
				}, function (err) { $scope.error = err; }
						);
				
				HourTypeResource.query({}, function (result) {
					$scope.hourTypes = result;
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "BOOK") {
							$scope.bookedHourType = result[i];
							break;
						}
					}
				}, function (err) { $scope.error = err; }
						);
			};

			$scope.addHoursEntry = function () {
				$scope.itemHoursResource.HourType = $scope.bookedHourType;
				$scope.itemHoursResource.HourTypeId = $scope.bookedHourType.Id;
				$scope.itemHoursResource.$add({}, function () {
					alert('success');
				}, function (err) { $scope.error = err; }
					);
			};

			//DatePickers ----------

			$scope.dateOptions = {
				'year-format': "'yy'",
				'starting-day': 1
			};

			$scope.openDtStart = function () {
				$timeout(function () {
					$scope.openedDtStart = true;
				});
			};

			$scope.openDtEnd = function () {
				if ($scope.useEndDate) {
					$timeout(function () {
						$scope.openedDtEnd = true;
					});
				}
			};
		}]);