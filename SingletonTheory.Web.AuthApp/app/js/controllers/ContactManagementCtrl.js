'use strict';

userApplicationModule.controller('ContactManagementCtrl',
	['$rootScope', '$scope', '$location', '$timeout', 'AuthService', 'ContactsResource', 'ContactResource', 'localize', 'TitlesResource', 'ContactTypesResource', 'EntityTypesResource', 'OccupationNamesResource', function ($rootScope, $scope, $location, $timeout, authService, contactsResource, contactResource, localize, titlesResource, contactTypesResource, entityTypesResource, occupationNamesResource) {


		// ************************ INFO AREA ************************************************************************
		//Filters
		$scope.filterOptions = {
			filterText: '',
			useExternalFilter: false
		};

		//********** init **********
		$scope.init = function () {
			$scope.refresh();
		};

		//========== refresh ==========
		$scope.refresh = function () {
			contactsResource.get({}, function (response) {
				$scope.contacts = response;
			});
			
			$scope.setContentArea();
		};

		// ******** info area grid *************************
		$scope.lastRowId = 0;
		$scope.mainColumnDefs = [{ field: 'EntityName', displayName: localize.getLocalizedString('_EntityNameHeading_') },
				{ field: 'Surname', displayName: localize.getLocalizedString('_SurnameHeading_') }];

		$scope.contactsGrid = {
			data: 'contacts',
			filterOptions: $scope.filterOptions,
			showFilter: true,
			columnDefs: 'mainColumnDefs',
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				//NOTE : This event is called twice once to select and then to decelect
				if (data.entity.Id != $scope.lastRowId) {
					$scope.setContentArea();
					$scope.editContact(data);
					$scope.lastRowId = data.entity.Id;
				}
			}
		};

		var setSelectedContact = function (entity) {
			$scope.elementResource = entity;
		};

		// Edit area

		$scope.addContact = function () {
			$scope.isNew = true;
			$scope.isEdit = false;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new contactResource();
			$scope.elementResource.Id = 0;
			$scope.elementResource.Active = true;
			$scope.elementResource.Language = $scope.Language;

			$scope.toggleCollapse();
		};

		$scope.editContact = function (row) {
			$scope.isNew = false;
			$scope.isEdit = true;

			$scope.elementResource = new contactResource();

			contactResource.get({ Id: row.entity.Id }, function (response) {
				$scope.elementResource = response;
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isCollapsed = true;
		};

		$scope.saveNewContact = function () {
			$scope.elementResource.$add(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.saveContact = function () {
			$scope.elementResource.$update(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelContactSave = function () {
			$scope.toggleCollapse();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// ************************ END INFO AREA *************************************
		// ----------------------------------------------------------------------------
		// ************************ CONTENT AREA **************************************

		$scope.setContentArea = function () {

			titlesResource.get({}, function (response) {
				$scope.titles = response;
			});

			contactTypesResource.get({}, function (response) {
				$scope.contactTypes = response;
			});

			entityTypesResource.get({}, function (response) {
				$scope.entityTypes = response;
			});

			occupationNamesResource.get({}, function (response) {
				$scope.occupationNames = response;
			});
			$scope.dt = new Date();
		};
		
		//DatePicker
		
		$scope.open = function () {
			$timeout(function () {
				$scope.opened = true;
			});
		};

		$scope.dateOptions = {
			'year-format': "'yy'",
			'starting-day': 1
		};
	}]);

