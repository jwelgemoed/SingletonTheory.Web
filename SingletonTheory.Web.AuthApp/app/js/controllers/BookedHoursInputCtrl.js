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
			$scope.gridSource = [];
			
			$scope.enteredHoursGridOptions = {
				data: 'gridSource',
		//		columnDefs: 'mainKeyColumnDefs',
				enableRowSelection: false,
				plugins: [new ngGridFlexibleHeightPlugin()]
			};

			$scope.init = function () {
				$scope.itemHoursResource = new ItemHoursEntryResource();
				
				CostCentreResource.query({}, function (result) {
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "PROD" ) {
							$scope.costCentres[0] = result[i];
						}
						if (result[i].LookupCode == "PNTG") {
							$scope.costCentres[1] = result[i];
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
				if ($scope.itemHoursResource.CostCentreId == $scope.costCentres[0].Id) {
					$scope.itemHoursResource.CostCentre = $scope.costCentres[0];
				} else {
					$scope.itemHoursResource.CostCentre = $scope.costCentres[1];
				}
				$scope.itemHoursResource.$add({}, function () {
					var enteredHoursItem = {
						HourType: $scope.itemHoursResource.HourType.Description,
						PersonNumber: $scope.itemHoursResource.PersonNumber,
						Date: $scope.itemHoursResource.Date,
						ConstCentre: $scope.itemHoursResource.CostCentre.Description,
						OrderNumber: $scope.itemHoursResource.OrderNumber,
						RoomNumber: $scope.itemHoursResource.RoomNumber,
						ItemNumber: $scope.itemHoursResource.ItemNumber,
						Hours: $scope.itemHoursResource.Hours,
						Description: $scope.itemHoursResource.Description
					};

					$scope.gridSource[$scope.gridSource.length] = enteredHoursItem;
					$scope.itemHoursResource = new ItemHoursEntryResource();
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