'use strict';

userApplicationModule.controller('ContactManagementCtrl',
	['$rootScope', '$scope', '$location', '$timeout', 'AuthService', 'ContactsResource', 'ContactResource', 'localize', 'TitlesResource', 'ContactTypesResource', 'EntityTypesResource', 'OccupationNamesResource', 'AddressesResource', 'AddressResource', 'AddressTypesResource', function ($rootScope, $scope, $location, $timeout, authService, contactsResource, contactResource, localize, titlesResource, contactTypesResource, entityTypesResource, occupationNamesResource, addressesResource, addressResource, addressTypesResource) {

		$scope.canCreate = true;
		$scope.isCollapsed = true;
		$scope.isNew = true;
		$scope.isEdit = false;
		$scope.selectedElement = [];
		
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
				$scope.selectedElement[0] = $scope.contacts[0];
				$scope.editContact($scope.contacts[0]);
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
					$scope.editContact(data.entity);
					$scope.editAddresses(data.entity);
					$scope.lastRowId = data.entity.Id;
				}
			}
		};

		var setSelectedContact = function (entity) {
			$scope.elementResource = entity;
		};

		// Edit area

		$scope.addNewContact = function () {
			$scope.isNew = true;
			$scope.isEdit = false;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new contactResource();
			$scope.elementResource.TitleId = $scope.titles[0].Id;
			$scope.elementResource.ContactTypesId = $scope.contactTypes[0].Id;
			$scope.elementResource.EntityTypesId = $scope.entityTypes[0].Id;
			$scope.elementResource.OccupationNamesId = $scope.occupationNames[0].Id;
			
			$scope.toggleCollapse();
		};
		
		$scope.editAddresses = function (entity) {
			$scope.isNew = false;
			$scope.isEdit = true;

			$scope.addressesResource = new addressesResource();
			$scope.addressResource = new addressResource();
			$scope.addressResource = entity.Id;
			
			addressesResource.get({ Id: entity.Id }, function (response) {
				$scope.addressesResource = response;
				$scope.addressResource = $scope.addressesResource[0];
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isCollapsed = true;
		};
		
		$scope.editContact = function (entity) {
			$scope.isNew = false;
			$scope.isEdit = true;

			$scope.elementResource = new contactResource();
			$scope.elementResource.TitleId = $scope.titles[0].Id;
			$scope.elementResource.ContactTypesId = $scope.contactTypes[0].Id;
			$scope.elementResource.EntityTypesId = $scope.entityTypes[0].Id;
			$scope.elementResource.OccupationNamesId = $scope.occupationNames[0].Id;
			
			contactResource.get({ Id: entity.Id }, function (response) {
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
			
			addressTypesResource.get({}, function (response) {
				$scope.addressTypes = response;
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

