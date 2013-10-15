'use strict';

userApplicationModule.controller('LocaleAdminCtrl',
	['$rootScope', '$scope', 'localize', 'AuthService', 'LocalizationDictionaryResource', 'LocalizationKeyDictionaryResource', 'LocalizationLocaleCollectionResource',
		function ($rootScope, $scope, localize, AuthService, LocalizationDictionaryResource, LocalizationKeyDictionaryResource, LocalizationLocaleCollectionResource) {

			$scope.localizationType = '_LocaleKeyHeading_';
			$scope.displayLocalizationType = '';

			$scope.keyDictionary = '';
			$scope.localeDictionary = '';

			$scope.canCreate = true;
			$scope.isCollapsed = false;

			$scope.isKeyEdit = true;

			$scope.selectedKeyElement = [];

			$scope.selectedLocaleElement = [];

			$scope.subKeySource = [];
			$scope.subLocaleSource = [];

			$scope.newSubKeyElement = new LocalizationKeyDictionaryResource();
			$scope.newSubLocaleElement = new LocalizationDictionaryResource();

			$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
			$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
			$scope.valueHeading = localize.getLocalizedString('_ValueHeading_');
			$scope.localeHeading = localize.getLocalizedString('_LocaleHeading_');
			$scope.keyHeading = localize.getLocalizedString('_KeyHeading_');
			$scope.editableInPopup = '<button type="button"  class="btn btn-default" ng-click="deleteElement(row)"><i class="icon-remove-sign icon-black" style="color:red!important"></i></button> ';

			setHeadings();

			$scope.$on('localizeResourcesUpdates', function () {
				$scope.displayLocalizationType = localize.getLocalizedString($scope.localizationType);
				$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
				$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
				$scope.valueHeading = localize.getLocalizedString('_ValueHeading_');
				$scope.localeHeading = localize.getLocalizedString('_LocaleHeading_');
				$scope.keyHeading = localize.getLocalizedString('_KeyHeading_');
				setHeadings();
			});

			function setHeadings() {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.mainKeyColumnDefs = [{ field: 'Key', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
						$scope.keyValueColumnDefs = [{ field: 'Locale', displayName: $scope.localeHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];
						break;
					case '_LocaleHeading_':
						$scope.mainLocaleColumnDefs = [{ field: 'LocaleKey', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
						$scope.keyLocaleColumnDefs = [{ field: 'Key', displayName: $scope.keyHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];
						break;
				}
			}

			$scope.keyGridOptions = {
				data: 'keyDictionary',
				columnDefs: 'mainKeyColumnDefs',
				selectedItems: $scope.selectedKeyElement,
				multiSelect: false,
				plugins: [new ngGridFlexibleHeightPlugin()],
				afterSelectionChange: function (data) {
					fireSubSelection();
				}
			};

			$scope.localeGridOptions = {
				data: 'localeDictionary',
				columnDefs: 'mainLocaleColumnDefs',
				selectedItems: $scope.selectedLocaleElement,
				multiSelect: false,
				plugins: [new ngGridFlexibleHeightPlugin()],
				afterSelectionChange: function (data) {
					fireSubSelection();
				}
			};

			$scope.deleteElement = function (row) {
				var confirmed = confirm(localize.getLocalizedString('_DeleteConfirmMessage_'));
				if (confirmed) {
					$scope.subKeySource.$remove({ key: row.entity.Key }, function () {
						getElementData();
					}, function (err) { $scope.error = err; }
				);
				}
			};

			$scope.keyValueGridOptions = {
				data: 'subKeySource.KeyValues',
				columnDefs: 'keyValueColumnDefs',
				enableCellSelection: true,
				enableRowSelection: false,
				enableCellEdit: true,
				multiSelect: false,
				plugins: [new ngGridFlexibleHeightPlugin()]
			};

			$scope.localeValueGridOptions = {
				data: 'subLocaleSource.LocalizationData',
				columnDefs: 'keyLocaleColumnDefs',
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
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.subKeySource.$update({ key: $scope.selectedKeyElement[0].Key }, function (result) {
							//todo Successfunction
						}, function (err) { $scope.error = err; }
					);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$update({ key: $scope.selectedLocaleElement[0].LocaleKey }, function (result) {
							//todo Successfunction
						}, function (err) { $scope.error = err; }
					);
						break;
				}
			};

			$scope.saveType = function () {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						if ($scope.newSubKeyElement.Key.substr(0, 1) != '_') {
							$scope.newSubKeyElement.Key = '_' + $scope.newSubKeyElement.Key;
						}
						if ($scope.newSubKeyElement.Key.substr($scope.newSubKeyElement.Key.length - 1, 1) != '_') {
							$scope.newSubKeyElement.Key = $scope.newSubKeyElement.Key + '_';
						}
						$scope.subKeySource = $scope.newSubKeyElement;
						$scope.newSubKeyElement = new LocalizationKeyDictionaryResource();
						$scope.subKeySource.$add({ key: $scope.subKeySource.Key }, function (result) {
							getElementData();
							expandCollapse();
						}, function (err) { $scope.error = err; }
							);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$add({ locale: $scope.subLocaleSource.LocaleKey }, function (result) {
							getElementData();
							expandCollapse();
						}, function (err) { $scope.error = err; }
							);
						break;
				}

			};

			function expandCollapse() {
				$scope.isCollapsed = !$scope.isCollapsed;
			}

			$scope.addType = function () {
				expandCollapse();
			};

			$scope.cancelTypeSave = function () {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.newSubKeyElement = new LocalizationKeyDictionaryResource();
						break;
					case '_LocaleHeading_':
						$scope.newSubLocaleElement = new LocalizationDictionaryResource();
						break;
				}
				expandCollapse();
			};

			function fireSubSelection() {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						if ($scope.selectedKeyElement.length > 0) {
							setElementSubLists($scope.selectedKeyElement[0].Key);
						}
						break;
					case '_LocaleHeading_':
						if ($scope.selectedLocaleElement.length > 0) {
							setElementSubLists($scope.selectedLocaleElement[0].LocaleKey);
						}
						break;
				}
			};

			function setElementSubLists(element) {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.subKeySource.$get({ key: element }, function (result) {
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$get({ locale: element }, function (result) {
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
					);
						break;
				}
			}

			function getElementData() {
				setHeadings();
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.isKeyEdit = true;
						LocalizationDictionaryResource.query({}, function (result) {
							$scope.keyDictionary = result.LocalizationData;
							$scope.subKeySource = new LocalizationKeyDictionaryResource();
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':
						$scope.isKeyEdit = false;
						LocalizationLocaleCollectionResource.query({}, function (result) {
							$scope.localeDictionary = result.Locales;
							$scope.subLocaleSource = new LocalizationDictionaryResource();
							//selectFirst(result);
						}, function (err) { $scope.error = err; }
						);

						break;
				}
			}
		}]);