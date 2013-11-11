'use strict';

userApplicationModule.controller('BudgetedHoursInputCtrl',
	['$rootScope', '$scope', '$timeout', '$exceptionHandler', 'localize', 'AuthService', 'RoomHoursEntryResource', 'CostCentreResource', 'HourTypeResource',
		function ($rootScope, $scope, $timeout, $exceptionHandler, localize, AuthService, RoomHoursEntryResource, CostCentreResource, HourTypeResource) {

			$scope.roomHoursResource = [];
			$scope.costCentres = [];
			$scope.hourTypes = [];
			$scope.bookedHourType = "";
			$scope.productionCostCentre = "";
			$scope.paintingCostCentre = "";
			$scope.gridSource = [];
			var previousBlurPerson = "";
			var previousBlurRoom = "";
			var previousBlurDate = "";
			$scope.dateFormat = "dd-MMMM-yyyy";

			setupGrids();

			$scope.$on('localizeResourcesUpdates', function () {
				setupGrids();
			});

			function setupGrids() {
				$scope.hourTypeHeading = localize.getLocalizedString('_HourTypeHeading_');
				$scope.deliveryDateHeading = localize.getLocalizedString('_DeliveryDateHeading_');
				$scope.costCentreHeading = localize.getLocalizedString('_CostCentreHeading_');
				$scope.orderNumberHeading = localize.getLocalizedString('_OrderNumberHeading_');
				$scope.roomNumberHeading = localize.getLocalizedString('_RoomNumberHeading_');
				$scope.hoursHeading = localize.getLocalizedString('_HoursHeading_');
				$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
				$scope.hoursEntryGridHeaders = [{ field: 'HourType', displayName: $scope.hourTypeHeading },
					{ field: 'OrderNumber', displayName: $scope.orderNumberHeading },
					{ field: 'RoomNumber', displayName: $scope.roomNumberHeading },
					{ field: 'CostCentre', displayName: $scope.costCentreHeading },
					{ field: 'Hours', displayName: $scope.hoursHeading },
					{ field: 'DeliveryDate', displayName: $scope.deliveryDateHeading },
					{ field: 'Description', displayName: $scope.descriptionHeading }];
			}

			$scope.enteredHoursGridOptions = {
				data: 'gridSource',
				columnDefs: 'hoursEntryGridHeaders',
				enableRowSelection: false,
				plugins: [new ngGridFlexibleHeightPlugin()]
			};

			$scope.init = function () {
				$scope.roomHoursResource = new RoomHoursEntryResource();

				CostCentreResource.query({}, function (result) {
					$scope.costCentres = result;
					$scope.roomHoursResource.CostCentreId = $scope.costCentres[0].Id;
				}, function (err) { throw localize.getLocalizedString('_CostCentreError_'); }
						);

				HourTypeResource.query({}, function (result) {
					$scope.hourTypes = result;
					for (var i = 0; i < result.length; i++) {
						if (result[i].LookupCode == "PLAN") {
							$scope.bookedHourType = result[i];
							break;
						}
					}
				}, function (err) { throw localize.getLocalizedString('_HourTypeError_'); }
						);
			};

			// TODO: Add to seperate library

			$scope.parseJsonDateValue = function (dateValue) {
				return new Date(parseInt(dateValue.substr(6))).toString($scope.dateFormat);
			};

			$scope.mainDataChanged = function () {
				if ($scope.roomHoursResource.PersonNumber != previousBlurPerson || $scope.roomHoursResource.DeliveryDate != previousBlurDate || $scope.roomHoursResource.RoomNumber != previousBlurRoom) {
					previousBlurPerson = $scope.roomHoursResource.PersonNumber;
					previousBlurRoom = $scope.roomHoursResource.RoomNumber;
					previousBlurDate = $scope.roomHoursResource.DeliveryDate;
					resetHourDetails();
					$scope.gridSource.length = 0;
				}
			};

			$scope.addHoursEntry = function () {
				$scope.roomHoursResource.HourType = $scope.bookedHourType;
				$scope.roomHoursResource.HourTypeId = $scope.bookedHourType.Id;

				if ($scope.roomHoursResource.CostCentreId == $scope.costCentres[0].Id) {
					$scope.roomHoursResource.CostCentre = $scope.costCentres[0];
				} else {
					$scope.roomHoursResource.CostCentre = $scope.costCentres[1];
				}

				$scope.roomHoursResource.$add({}, function () {

					var enteredHoursItem = {
						HourType: $scope.roomHoursResource.HourType.Description,
						PersonNumber: $scope.roomHoursResource.PersonNumber,
						DeliveryDate: $scope.parseJsonDateValue($scope.roomHoursResource.DeliveryDate),
						CostCentre: $scope.roomHoursResource.CostCentre.Code + ' - ' + $scope.roomHoursResource.CostCentre.Description,
						OrderNumber: $scope.roomHoursResource.OrderNumber,
						RoomNumber: $scope.roomHoursResource.RoomNumber,
						Hours: $scope.roomHoursResource.Hours,
						Description: $scope.roomHoursResource.Description
					};

					$scope.gridSource[$scope.gridSource.length] = enteredHoursItem;
					resetHourDetails();
					$scope.roomHoursResource.CostCentreId = $scope.costCentres[0].Id;
					document.getElementById('costCentreSelection').focus();

				}, function (err) { throw localize.getLocalizedString('_HourAddError_'); }
					);
			};

			function resetHourDetails() {
				resetDetailFields();
			}

			function resetDetailFields() {
				$scope.roomHoursResource.Id = 0;
				$scope.roomHoursResource.Hours = "";
				$scope.roomHoursResource.DeliveryDate = "";
				$scope.roomHoursResource.Description = "";
			}
		}]);