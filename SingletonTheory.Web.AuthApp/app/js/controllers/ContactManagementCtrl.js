'use strict';

userApplicationModule.controller('ContactManagementCtrl',
	['$rootScope', '$scope', '$location', '$timeout', 'AuthService', 'ContactDetailsResource', 'ContactDetailResource', 'localize', 'TitlesResource', 'ContactTypesResource', 'EntityTypesResource', 'OccupationNamesResource', 'AddressesResource', 'AddressResource', 'AddressTypesResource', 'ContactsResource', 'ContactResource', function ($rootScope, $scope, $location, $timeout, authService, contactDetailsResource, contactDetailResource, localize, titlesResource, contactTypesResource, entityTypesResource, occupationNamesResource, addressesResource, addressResource, addressTypesResource, contactsResource, contactResource) {

		$scope.canCreate = true;
		$scope.isCollapsed = true;
		$scope.isAddressCollapsed = true;
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
			$scope.setTypes();
			contactDetailsResource.get({}, function (response) {
				$scope.contactDetails = response;
				$scope.selectedElement[0] = $scope.contactDetails[0];
				$scope.editContactDetail($scope.contactDetails[0]);
				$scope.editAddresses($scope.contactDetails[0]);
				$scope.editContacts($scope.contactDetails[0]);
			});
		};

		// ******** info area grid *************************
		$scope.lastRowId = 0;
		$scope.mainColumnDefs = [{ field: 'EntityName', displayName: localize.getLocalizedString('_EntityNameHeading_') },
				{ field: 'Surname', displayName: localize.getLocalizedString('_SurnameHeading_') }];

		$scope.contactsGrid = {
			data: 'contactDetails',
			filterOptions: $scope.filterOptions,
			showFilter: true,
			columnDefs: 'mainColumnDefs',
			selectedItems: $scope.selectedElement,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				//NOTE : This event is called twice once to select and then to decelect
				if (data.entity.EntityId != $scope.lastRowId) {
					$scope.setTypes();
					$scope.editContactDetail(data.entity);
					$scope.editAddresses(data.entity);
					$scope.editContacts(data.entity);
					$scope.lastRowId = data.entity.EntityId;
				}
			}
		};

		// Edit area
		$scope.addNewContactDetail = function () {
			$scope.isNew = true;
			$scope.isEdit = false;

			$scope.passwordIsRequired = true;

			$scope.elementResource = new contactDetailResource();
			try {
				$scope.elementResource.TitleId = $scope.titles[0].Id;
				$scope.elementResource.ContactTypesId = $scope.contactTypes[0].Id;
				$scope.elementResource.EntityTypesId = $scope.entityTypes[0].Id;
				$scope.elementResource.OccupationNamesId = $scope.occupationNames[0].Id;
			} catch (e) {
				$scope.error = e;
			}

			$scope.toggleCollapse();
		};

		$scope.editContactDetail = function (entity) {
			$scope.isNew = false;
			$scope.isEdit = true;

			$scope.elementResource = new contactDetailResource();

			try {
				$scope.elementResource.TitleId = $scope.titles[0].Id;
				$scope.elementResource.ContactTypesId = $scope.contactTypes[0].Id;
				$scope.elementResource.EntityTypesId = $scope.entityTypes[0].Id;
				$scope.elementResource.OccupationNamesId = $scope.occupationNames[0].Id;
			} catch (err) {
				$scope.error = err;
			}

			contactDetailResource.get({ EntityId: entity.EntityId }, function (response) {
				$scope.elementResource = response;

			},
			function (error) {
				$scope.error = error;
			});

			$scope.isCollapsed = true;
		};

		$scope.saveNewContactDetail = function () {
			$scope.elementResource.$add(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.saveContactDetail = function () {
			$scope.elementResource.$update(function () {
				$scope.toggleCollapse();
				$scope.refresh();
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelContactDetailSave = function () {
			$scope.toggleCollapse();
		};

		$scope.toggleCollapse = function () {
			$scope.isCollapsed = !$scope.isCollapsed;
		};

		// ************************ END INFO AREA *************************************
		// ----------------------------------------------------------------------------
		// ************************ CONTENT AREA **************************************

		$scope.setTypes = function () {

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


		//ADRESS ---------------------------------------------------------------------

		$scope.isAddressCollapsed = true;
		$scope.addressData = [];
		$scope.addressData.length = 0;
		$scope.usedAddressTypeIds = [];
		$scope.usedAddressTypeIds.length = 0;
		$scope.availableAddressTypes = [];
		$scope.availableAddressTypes.length = 0;
		$scope.canUpdateAddress = true;
		// ******** info area grid *************************
		$scope.editableInPopup = '<button type="button" ng-disabled="!canUpdateAddress"  class="btn btn-default" ng-click="editAddress(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.lastRowAddressId = 0;
		$scope.mainAddressColumnDefs = [{ field: 'AddressType', displayName: localize.getLocalizedString('_AddressTypeHeading_') },
				{ field: 'Preferred', displayName: localize.getLocalizedString('_PreferredHeading_') },
				{ field: 'Street', displayName: localize.getLocalizedString('_StreetHeading_') },
				{ field: 'PostalCode', displayName: localize.getLocalizedString('_PostalCodeHeading_') },
				{ field: 'City', displayName: localize.getLocalizedString('_CityHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
		//{ Id: id, EntityId: entityId, AddressType: addressType, Preferred: preferred, Street: street, PostalCode: postalCode, City: city };
		$scope.addressGridOptions = {
			data: 'addressData',
			//filterOptions: $scope.filterOptions,
			showFilter: false,
			columnDefs: 'mainAddressColumnDefs',
			selectedItems: $scope.selectedAdress,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				//NOTE : This event is called twice once to select and then to decelect
				//if (data.entity.Id != $scope.lastRowAddressId) {
				//	$scope.editAddress(data.entity);
				//	$scope.lastRowAddressId = data.entity.Id;
				//}
			}
		};

		$scope.editAddresses = function (entity) {

			$scope.addressData.length = 0;

			$scope.addressesResource = new addressesResource();
			$scope.addressResource = new addressResource();
			$scope.addressResource.EntityId = entity.EntityId;
			$scope.currentEntityId = entity.EntityId;
			$scope.addressResource.addressTypeId = $scope.addressTypes[0].Id;

			addressesResource.get({ EntityId: entity.EntityId }, function (response) {
				$scope.addressesResource = response;
				$scope.addressResource = $scope.addressesResource[0];

				setAddressGridData();
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isAddressCollapsed = true;
		};

		var setAddressGridData = function () {
			$scope.usedAddressTypeIds.length = 0;
			for (var i = 0; i < $scope.addressesResource.length; i++) {
				var id = $scope.addressesResource[i].Id;
				var entityId = $scope.addressesResource[i].EntityId;
				var addressType = getAddressType($scope.addressesResource[i].AddressTypeId);
				var street = $scope.addressesResource[i].Street;
				var preferred = $scope.addressesResource[i].Preferred;
				var postalCode = $scope.addressesResource[i].PostalCode;
				var city = $scope.addressesResource[i].City;
				var address = { Id: id, EntityId: entityId, AddressType: addressType, Preferred: preferred, Street: street, PostalCode: postalCode, City: city };
				$scope.addressData.push(address);
				$scope.usedAddressTypeIds.push($scope.addressesResource[i].AddressTypeId);
			}
		};

		var setAddressTypesAvailable = function (id) {
			$scope.availableAddressTypes.length = 0;
			var ids = $scope.usedAddressTypeIds;
			remove(ids, id);
			for (var i = 0; i < $scope.addressTypes.length; i++) {
				if (!contains(ids, $scope.addressTypes[i].Id)) {
					$scope.availableAddressTypes.push($scope.addressTypes[i]);
				}
			}
		};

		var getAddressType = function (addressTypeId) {
			for (var i = 0; i < $scope.addressTypes.length; i++) {
				if (addressTypeId == $scope.addressTypes[i].Id) {
					return $scope.addressTypes[i].Description;
				}
			}
			return "";
		};

		$scope.addNewAddress = function () {
			$scope.isAddressNew = true;
			$scope.isAddressEdit = false;

			$scope.addressResource = new addressResource();
			$scope.addressResource.EntityId = $scope.currentEntityId;
			setAddressTypesAvailable(-1);
			$scope.addressResource.AddressTypeId = $scope.availableAddressTypes[0].Id;
			$scope.toggleAddressCollapse();
		};

		$scope.editAddress = function (row) {
			$scope.isAddressNew = false;
			$scope.isAddressEdit = true;

			$scope.addressResource = new addressResource();

			addressResource.get({ Id: row.entity.Id }, function (response) {
				$scope.addressResource = response;
				setAddressTypesAvailable(response.AddressTypeId);
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isAddressCollapsed = false;
		};

		$scope.saveNewAddress = function () {
			$scope.addressResource.$add(function () {
				$scope.toggleAddressCollapse();
				$scope.editAddresses($scope.selectedElement[0]);
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.saveAddress = function () {
			$scope.addressResource.$update(function () {
				$scope.toggleAddressCollapse();
				$scope.editAddresses($scope.selectedElement[0]);
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelAddressSave = function () {
			$scope.toggleAddressCollapse();
		};

		$scope.toggleAddressCollapse = function () {
			$scope.isAddressCollapsed = !$scope.isAddressCollapsed;
		};

		//Address ---------------------------------------------------------------------
		
		//Contact ---------------------------------------------------------------------

		$scope.isContactCollapsed = true;
		$scope.contactData = [];
		$scope.contactData.length = 0;
		$scope.usedContactTypeIds = [];
		$scope.usedContactTypeIds.length = 0;
		$scope.availableContactTypes = [];
		$scope.availableContactTypes.length = 0;
		$scope.canUpdateContact = true;
		// ******** info area grid *************************
		$scope.editableInPopup = '<button type="button" ng-disabled="!canUpdateContact"  class="btn btn-default" ng-click="editContact(row)"><i class="icon-edit icon-black"></i></button> ';

		$scope.lastRowContactId = 0;
		$scope.mainContactColumnDefs = [{ field: 'ContactType', displayName: localize.getLocalizedString('_ContactTypeHeading_') },
				{ field: 'Preferred', displayName: localize.getLocalizedString('_PreferredHeading_') },
				{ field: 'Value', displayName: localize.getLocalizedString('_ValueHeading_') },
				 { displayName: '', cellTemplate: $scope.editableInPopup, width: 40 }];
		
		$scope.contactGridOptions = {
			data: 'contactData',
			//filterOptions: $scope.filterOptions,
			showFilter: false,
			columnDefs: 'mainContactColumnDefs',
			selectedItems: $scope.selectedContact,
			multiSelect: false,
			plugins: [new ngGridFlexibleHeightPlugin()],
			afterSelectionChange: function (data) {
				//NOTE : This event is called twice once to select and then to decelect
				//if (data.entity.Id != $scope.lastRowContactId) {
				//	$scope.editContact(data.entity);
				//	$scope.lastRowContactId = data.entity.Id;
				//}
			}
		};

		$scope.editContacts = function (entity) {
			$scope.contactData.length = 0;

			$scope.contactsResource = new contactsResource();
			$scope.contactResource = new contactResource();
			$scope.contactResource.EntityId = entity.EntityId;
			$scope.currentEntityId = entity.EntityId;
			$scope.contactResource.contactTypeId = $scope.contactTypes[0].Id;

			contactsResource.get({ EntityId: entity.EntityId }, function (response) {
				$scope.contactsResource = response;
				$scope.contactResource = $scope.contactsResource[0];

				setContactGridData();
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isContactCollapsed = true;
		};

		var setContactGridData = function () {
			$scope.usedContactTypeIds.length = 0;
			for (var i = 0; i < $scope.contactsResource.length; i++) {
				var id = $scope.contactsResource[i].Id;
				var entityId = $scope.contactsResource[i].EntityId;
				var contactType = getContactType($scope.contactsResource[i].ContactTypeId);
				var value = $scope.contactsResource[i].Value;
				var preferred = $scope.contactsResource[i].Preferred;
			
				var contact = { Id: id, EntityId: entityId, ContactType: contactType, Preferred: preferred, Value: value};
				$scope.contactData.push(contact);
				$scope.usedContactTypeIds.push($scope.contactsResource[i].ContactTypeId);
			}
		};

		var setContactTypesAvailable = function (id) {
			$scope.availableContactTypes.length = 0;
			var ids = $scope.usedContactTypeIds;
			remove(ids, id);
			for (var i = 0; i < $scope.contactTypes.length; i++) {
				if (!contains(ids, $scope.contactTypes[i].Id)) {
					$scope.availableContactTypes.push($scope.contactTypes[i]);
				}
			}
		};

		var getContactType = function (contactTypeId) {
			for (var i = 0; i < $scope.contactTypes.length; i++) {
				if (contactTypeId == $scope.contactTypes[i].Id) {
					return $scope.contactTypes[i].Description;
				}
			}
			return "";
		};

		$scope.addNewContact = function () {
			$scope.isContactNew = true;
			$scope.isContactEdit = false;

			$scope.contactResource = new contactResource();
			$scope.contactResource.EntityId = $scope.currentEntityId;
			setContactTypesAvailable(-1);
			$scope.contactResource.ContactTypeId = $scope.availableContactTypes[0].Id;
			$scope.toggleContactCollapse();
		};

		$scope.editContact = function (row) {
			$scope.isContactNew = false;
			$scope.isContactEdit = true;

			$scope.contactResource = new contactResource();

			contactResource.get({ Id: row.entity.Id }, function (response) {
				$scope.contactResource = response;
				setContactTypesAvailable(response.ContactTypeId);
			},
			function (error) {
				$scope.error = error;
			});

			$scope.isContactCollapsed = false;
		};

		$scope.saveNewContact = function () {
			$scope.contactResource.$add(function () {
				$scope.toggleContactCollapse();
				$scope.editContacts($scope.selectedElement[0]);
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.saveContact = function () {
			$scope.contactResource.$update(function () {
				$scope.toggleContactCollapse();
				$scope.editContacts($scope.selectedElement[0]);
			},
			function (error) {
				$scope.error = error;
			});
		};

		$scope.cancelContactSave = function () {
			$scope.toggleContactCollapse();
		};

		$scope.toggleContactCollapse = function () {
			$scope.isContactCollapsed = !$scope.isContactCollapsed;
		};

		//Contact ---------------------------------------------------------------------

		$scope.parseJsonDateValue = function (dateValue) {
			return new Date(parseInt(dateValue.substr(6))).toString($scope.dateFormat);
		};


		var contains = function (arr, obj) {
			for (var i = 0; i < arr.length; i++) {
				if (arr[i] === obj) {
					return true;
				}
			}
			return false;
		};

		var remove = function (arr, item) {
			for (var i = arr.length; i--;) {
				if (arr[i] === item) {
					arr.splice(i, 1);
				}
			}
		};

	}]);

