'use strict';

userApplicationModule.controller('LocaleAdminCtrl',
	['$rootScope', '$scope', 'localize', 'AuthService', 'LocalizationDictionaryResource', 'LocalizationKeyDictionaryResource', 'LocalizationLocaleCollectionResource',
		function ($rootScope, $scope, localize, AuthService, LocalizationDictionaryResource, LocalizationKeyDictionaryResource, LocalizationLocaleCollectionResource) {

			$scope.localizationType = '';
			$scope.displayLocalizationType = '';

			$scope.canDeleteKeys = false;
			$scope.canDeleteLocales = false;
			$scope.canEditKeys = false;
			$scope.canEditLocales = false;
			$scope.canCreateKeys = false;
			$scope.canCreateLocales = false;

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

			$scope.deleteKeyButton = '<button type="button" ng-disabled="!canDeleteKeys"  class="btn btn-default" ng-click="deleteElement(row)"><i class="icon-remove-sign icon-black" style="color:red!important"></i></button> ';

			$scope.deleteLocaleButton = '<button type="button" ng-disabled="!canDeleteLocales"  class="btn btn-default" ng-click="deleteElement(row)"><i class="icon-remove-sign icon-black" style="color:red!important"></i></button> ';

			setupGrids();

			$scope.$on('localizeResourcesUpdates', function () {
				setupGrids();
				authorizeMain();
				authorizeActions();
			});

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
					switch ($scope.localizationType) {
						case '_LocaleKeyHeading_':
							$scope.subKeySource.$remove({ key: row.entity.Key }, function () {
								getLocaleData();
							}, function (err) { $scope.error = err; }
							);
							break;
						case '_LocaleHeading_':
							$scope.subLocaleSource.$remove({ locale: row.entity.LocaleKey }, function () {
								getLocaleData();
							}, function (err) { $scope.error = err; }
							);
							break;
					}
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
				authorizeMain();
				authorizeActions();
			};

			$scope.selectType = function (typeName) {
				$scope.localizationType = typeName;
				$scope.displayLocalizationType = localize.getLocalizedString(typeName);
				getLocaleData();
			};

			$scope.isLocaleKey = function () {
				return ($scope.localizationType === '_LocaleKeyHeading_');
			};

			$scope.saveSubElements = function () {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.subKeySource.$update({ key: $scope.selectedKeyElement[0].Key }, function () {
							getLocaleData();
						}, function (err) { $scope.error = err; }
					);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$update({ key: $scope.selectedLocaleElement[0].LocaleKey }, function () {
							getLocaleData();
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
							getLocaleData();
							expandCollapse();
						}, function (err) { $scope.error = err; }
							);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$add({ locale: $scope.subLocaleSource.LocaleKey }, function (result) {
							getLocaleData();
							expandCollapse();
						}, function (err) { $scope.error = err; }
							);
						break;
				}

			};

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
			
			function authorizeMain() {
				AuthService.authorize(function () {
					$scope.displayLocalizationType = '_LocaleKeyHeading_';
					$scope.selectType($scope.displayLocalizationType);
				}, function () {
					$scope.displayLocalizationType = '_LocaleHeading_';
					$scope.selectType($scope.displayLocalizationType);
				}, 'LocaleKeyAdministration_Access');
			}

			function authorizeActions() {
				AuthService.authorize(function () {
					$scope.canCreateLocales = true;
				}, function () {
					$scope.canCreateLocales = false;
				}, 'LocaleAdministration_Create');

				AuthService.authorize(function () {
					$scope.canEditLocales = true;
				}, function () {
					$scope.canEditLocales = false;
				}, 'LocaleAdministration_Update');

				AuthService.authorize(function () {
					$scope.canDeleteLocales = true;
				}, function () {
					$scope.canDeleteLocales = false;
				}, 'LocaleAdministration_Delete');

				AuthService.authorize(function () {
					$scope.canCreateKeys = true;
				}, function () {
					$scope.canCreateKeys = false;
				}, 'LocaleKeyAdministration_Create');

				AuthService.authorize(function () {
					$scope.canEditKeys = true;
				}, function () {
					$scope.canEditKeys = false;
				}, 'LocaleKeyAdministration_Update');

				AuthService.authorize(function () {
					$scope.canDeleteKeys = true;
				}, function () {
					$scope.canDeleteKeys = false;
				}, 'LocaleKeyAdministration_Delete');
			}

			function setupGrids() {
				$scope.displayLocalizationType = localize.getLocalizedString($scope.localizationType);
				$scope.sortHeading = localize.getLocalizedString('_SortHeading_');
				$scope.descriptionHeading = localize.getLocalizedString('_DescriptionHeading_');
				$scope.valueHeading = localize.getLocalizedString('_ValueHeading_');
				$scope.localeHeading = localize.getLocalizedString('_LocaleHeading_');
				$scope.keyHeading = localize.getLocalizedString('_KeyHeading_');
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.mainKeyColumnDefs = [{ field: 'Key', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.deleteKeyButton, width: 40 }];
						$scope.keyValueColumnDefs = [{ field: 'Locale', displayName: $scope.localeHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];
						break;
					case '_LocaleHeading_':
						$scope.mainLocaleColumnDefs = [{ field: 'LocaleKey', displayName: $scope.sortHeading }, { displayName: '', cellTemplate: $scope.deleteLocaleButton, width: 40 }];
						$scope.keyLocaleColumnDefs = [{ field: 'Key', displayName: $scope.keyHeading, enableCellEdit: false }, { field: 'Value', displayName: $scope.valueHeading, enableCellEdit: true }, { field: 'Description', displayName: $scope.descriptionHeading, enableCellEdit: true }];
						break;
				}
			}

			function selectFirst() {
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						if ($scope.keyDictionary.length > 0) {
							$scope.keyGridOptions.selectedItems[0] = $scope.keyDictionary[0];
							fireSubSelection();
						}
						break;
					case '_LocaleHeading_':
						if ($scope.localeDictionary.length > 0) {
							$scope.localeGridOptions.selectedItems[0] = $scope.localeDictionary[0];
							fireSubSelection();
						}
						break;
				}
			}

			function expandCollapse() {
				$scope.isCollapsed = !$scope.isCollapsed;
			}

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
						$scope.subKeySource.$get({ key: element }, null, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':
						$scope.subLocaleSource.$get({ locale: element }, null, function (err) { $scope.error = err; }
					);
						break;
				}
			}

			function getLocaleData() {
				setupGrids();
				switch ($scope.localizationType) {
					case '_LocaleKeyHeading_':
						$scope.isKeyEdit = true;
						LocalizationDictionaryResource.query({}, function (result) {
							$scope.keyDictionary = result.LocalizationData;
							$scope.subKeySource = new LocalizationKeyDictionaryResource();
							selectFirst();
						}, function (err) { $scope.error = err; }
						);
						break;
					case '_LocaleHeading_':
						$scope.isKeyEdit = false;
						LocalizationLocaleCollectionResource.query({}, function (result) {
							$scope.localeDictionary = result.Locales;
							$scope.subLocaleSource = new LocalizationDictionaryResource();
							selectFirst();
						}, function (err) { $scope.error = err; }
						);

						break;
				}
			}
		}]);