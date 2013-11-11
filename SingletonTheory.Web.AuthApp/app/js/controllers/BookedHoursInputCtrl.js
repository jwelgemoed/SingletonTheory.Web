'use strict';

userApplicationModule.controller('BookedHoursInputCtrl',
	['$rootScope', '$scope', '$timeout', '$exceptionHandler', 'localize', 'AuthService', 'ItemHoursEntryResource', 'CostCentreResource', 'HourTypeResource',
		function ($rootScope, $scope, $timeout, $exceptionHandler, localize, AuthService, ItemHoursEntryResource, CostCentreResource, HourTypeResource) {

			$scope.itemHoursResource = [];
			$scope.costCentres = [];
			$scope.hourTypes = [];
			$scope.bookedHourType = "";
			$scope.productionCostCentre = "";
			$scope.paintingCostCentre = "";
			$scope.gridSource = [];
			var previousBlurPerson = "";
			var previousBlurDate = "";
			$scope.dateFormat = "dd-MMMM-yyyy";
			
			setupGrids();

			$scope.$on('localizeResourcesUpdates', function () {
				setupGrids();
			});
			
			function setupGrids() {
				$scope.hourTypeHeading = localize.getLocalizedString('_HourTypeHeading_');
				$scope.personNumberHeading = localize.getLocalizedString('_PersonNumberHeading_');
				$scope.hoursDateHeading = localize.getLocalizedString('_HoursDateHeading_');
				$scope.costCentreHeading = localize.getLocalizedString('_CostCentreHeading_');
				$scope.orderNumberHeading = localize.getLocalizedString('_OrderNumberHeading_');
				$scope.roomNumberHeading = localize.getLocalizedString('_RoomNumberHeading_');
				$scope.itemNumberHeading = localize.getLocalizedString('_ItemNumberHeading_');
				$scope.hoursHeading = localize.getLocalizedString('_HoursHeading_');
				$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
				$scope.hoursEntryGridHeaders = [{ field: 'HourType', displayName: $scope.hourTypeHeading },
					{ field: 'PersonNumber', displayName: $scope.personNumberHeading },
					{ field: 'Date', displayName: $scope.hoursDateHeading },
					{ field: 'CostCentre', displayName: $scope.costCentreHeading },
					{ field: 'OrderNumber', displayName: $scope.orderNumberHeading },
					{ field: 'RoomNumber', displayName: $scope.roomNumberHeading },
					{ field: 'ItemNumber', displayName: $scope.itemNumberHeading },
					{ field: 'Hours', displayName: $scope.hoursHeading },
					{ field: 'Description', displayName: $scope.descriptionHeading }];
			}
			
			$scope.enteredHoursGridOptions = {
				data: 'gridSource',
				columnDefs: 'hoursEntryGridHeaders',
				enableRowSelection: false,
				plugins: [new ngGridFlexibleHeightPlugin()]
			};

			$scope.init = function () {
				$scope.itemHoursResource = new ItemHoursEntryResource();
				
				CostCentreResource.query({}, function (result) {
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "PROD" ) {
							$scope.costCentres[0] = result[i];
							$scope.itemHoursResource.CostCentreId = $scope.costCentres[0].Id;
						}
						if (result[i].LookupCode == "PNTG") {
							$scope.costCentres[1] = result[i];
						}
					}
				}, function (err) { throw localize.getLocalizedString('_CostCentreError_'); }
						);
				
				HourTypeResource.query({}, function (result) {
					$scope.hourTypes = result;
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "BOOK") {
							$scope.bookedHourType = result[i];
							break;
						}
					}
				}, function (err) { throw localize.getLocalizedString('_HourTypeError_'); }
						);
			};

			$scope.error = "fuck you";
			// TODO: Add to seperate library

			$scope.parseJsonDateValue = function (dateValue) {
				return new Date(parseInt(dateValue.substr(6))).toString($scope.dateFormat);
			};

			$scope.personDateChanged = function () {
				if ($scope.itemHoursResource.PersonNumber != previousBlurPerson || $scope.itemHoursResource.Date != previousBlurDate) {
					previousBlurPerson = $scope.itemHoursResource.PersonNumber;
					previousBlurDate = $scope.itemHoursResource.Date;
					resetHourDetails();
					$scope.gridSource.length = 0;
				}
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
						Date: $scope.parseJsonDateValue($scope.itemHoursResource.Date),
						CostCentre: $scope.itemHoursResource.CostCentre.Code + ' - ' + $scope.itemHoursResource.CostCentre.Description,
						OrderNumber: $scope.itemHoursResource.OrderNumber,
						RoomNumber: $scope.itemHoursResource.RoomNumber,
						ItemNumber: $scope.itemHoursResource.ItemNumber,
						Hours: $scope.itemHoursResource.Hours,
						Description: $scope.itemHoursResource.Description
					};

					$scope.gridSource[$scope.gridSource.length] = enteredHoursItem;
					resetHourDetails();
					$scope.itemHoursResource.CostCentreId = $scope.costCentres[0].Id;
					document.getElementById('costCentreSelection').focus();
					
				}, function (err) { throw localize.getLocalizedString('_HourAddError_'); }
					);
			};

			function resetHourDetails() {
				resetDetailFields();
				$scope.itemHoursResource.Date = previousBlurDate;
			}

			function resetDetailFields() {
				$scope.itemHoursResource.Id = 0;
				$scope.itemHoursResource.OrderNumber = "";
				$scope.itemHoursResource.RoomNumber = "";
				$scope.itemHoursResource.ItemNumber = "";
				$scope.itemHoursResource.Hours = "";
				$scope.itemHoursResource.Description = "";
			}
		}]);