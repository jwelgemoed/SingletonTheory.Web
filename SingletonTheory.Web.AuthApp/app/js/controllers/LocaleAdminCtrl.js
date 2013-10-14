'use strict';

userApplicationModule.controller('LocaleAdminCtrl',
	['$rootScope', '$scope', 'localize', 'AuthService', 'LocalizationDictionaryResource', 'LocalizationKeyDictionaryResource',
		function ($rootScope, $scope, localize, AuthService, LocalizationDictionaryResource, LocalizationKeyDictionaryResource) {

			$scope.localizationType = '_LocaleKeyHeading_';
			$scope.displayLocalizationType = '';

			$scope.defaultLocaleDictionary = '';

			$scope.canCreate = true;
			$scope.isCollapsed = false;

			$scope.selectedElement = [];

			$scope.subElementSource = [];

			$scope.newSubElement = new LocalizationKeyDictionaryResource();

			$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
			$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
			$scope.valueHeading = localize.getLocalizedString('_ValueHeading_');
			$scope.localeHeading = localize.getLocalizedString('_LocaleHeading_');
			$scope.editableInPopup = '<button type="button"  class="btn btn-default" ng-click="deleteElement(row)"><i class="icon-remove-sign icon-black" style="color:red!important"></i></button> ';
			
			$scope.mainColumnDefs = [{ field: 'Key', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
			$scope.valueColumDefs = [{ field: 'Locale', displayName: $scope.localeHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];

			$scope.$on('localizeResourcesUpdates', function () {
				$scope.displayLocalizationType = localize.getLocalizedString($scope.localizationType);
				$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
				$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
				$scope.valueHeading = localize.getLocalizedString('_ValueHeading_');
				$scope.localeHeading = localize.getLocalizedString('_LocaleHeading_');
				$scope.mainColumnDefs = [{ field: 'Key', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
				$scope.valueColumDefs = [{ field: 'Locale', displayName: $scope.localeHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];
			});

			$scope.typeGridOptions = {
				data: 'defaultLocaleDictionary',
				columnDefs: 'mainColumnDefs',
				selectedItems: $scope.selectedElement,
				multiSelect: false,
				plugins: [new ngGridFlexibleHeightPlugin()],
				afterSelectionChange: function (data) {
					fireSubSelection();
				}
			};

			$scope.deleteElement = function (row) {
				var confirmed = confirm(localize.getLocalizedString('_DeleteConfirmMessage_'));
				if (confirmed) {
					$scope.subElementSource.$remove({ key: row.entity.Key }, function () {
						getElementData();
					}, function (err) { $scope.error = err; }
				);
				}
			}; 

			$scope.valueGridOptions = {
				data: 'subElementSource.KeyValues',
				columnDefs: 'valueColumDefs',
				enableCellSelection: true,
				enableRowSelection: false,
				enableCellEdit: true,
				multiSelect: false,
				plugins: [new ngGridFlexibleHeightPlugin()]
			};

			$scope.init = function () {
				$scope.selectType($scope.localizationType);
			};

			$scope.selectType = function (typeName) {
				$scope.localizationType = typeName;
				$scope.displayLocalizationType = localize.getLocalizedString(typeName);
				getElementData();
			};

			$scope.isLocaleKey = function () {
				return ($scope.localizationType === '_LocaleKeyHeading_');
			};

			$scope.saveSubElements = function () {
				$scope.subElementSource.$update({ key: $scope.selectedElement[0].Key }, function (result) {
				//todo Successfunction
				}, function (err) { $scope.error = err; }
						);
			};

			$scope.saveType = function () {
				if ($scope.newSubElement.Key.substr(0, 1) != '_') {
					$scope.newSubElement.Key = '_' + $scope.newSubElement.Key;
				}
				if ($scope.newSubElement.Key.substr($scope.newSubElement.Key.length - 1, 1) != '_') {
					$scope.newSubElement.Key = $scope.newSubElement.Key + '_';
				}
				$scope.subElementSource = $scope.newSubElement;
				$scope.newSubElement = new LocalizationKeyDictionaryResource();
				$scope.subElementSource.$add({ key: $scope.subElementSource.Key }, function (result) {
					getElementData();
					expandCollapse();
				}, function (err) { $scope.error = err; }
					);
			};

			function expandCollapse() {
				$scope.isCollapsed = !$scope.isCollapsed;
			}

			$scope.addType = function () {
				expandCollapse();
			}; 

			$scope.cancelTypeSave = function () {
				$scope.newSubElement = new LocalizationKeyDictionaryResource();
				expandCollapse();
			};

			function fireSubSelection() {
				if ($scope.selectedElement.length > 0) {
					setElementSubLists($scope.selectedElement[0].Key);
				}
			};

			function setElementSubLists(element) {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.subElementSource.$get({ key: element }, function (result) {
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':
						break;
				}
			}

			function getElementData() {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						LocalizationDictionaryResource.query({}, function (result) {
							$scope.defaultLocaleDictionary = result.LocalizationData;
							$scope.subElementSource = new LocalizationKeyDictionaryResource();
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':


						break;
				}
			}
		}]);