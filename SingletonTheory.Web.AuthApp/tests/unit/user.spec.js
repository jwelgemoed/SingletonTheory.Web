/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="../../app/lib/angular/angular.js" />
/// <reference path="../../app/lib/angular/angular-cookies.js" />
/// <reference path="../lib/angular/angular-mocks.js" />
/// <reference path="../../app/js/app.js" />
/// <reference path="../../app/js/services/AuthService.js" />
/// <reference path="../../app/js/services/UserServices.js" />
/// <reference path="../../app/js/routingConfig.js" />
/// <reference path="../../app/js/controllers/LoginCtrl.js" />
/// <reference path="mockdata/UsersMockData.js" />

describe('User administration', function () {

	var $scope;
	var $location;
	var $window;
	var $controller;
	var $httpBackend;
	var userService;
	var userResults;
	var userToAdd;
	var userAddResult;
	
	//you need to indicate your module in a test
	beforeEach(module(userApplicationModule.name, mockUserData.name));

	beforeEach(inject(function ($injector) {
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		$scope = $injector.get('$rootScope');
		$location = $injector.get('$location');
		$window = $injector.get('$window');
		$controller = $injector.get('$controller');
		userService = $injector.get('UserService');
		userResults = $injector.get('userResults');
		userToAdd = $injector.get('userToAdd');
		userAddResult = $injector.get('userAddResult');

		//// backend definition common for all tests
		$httpBackend.when('GET', '/userapi').respond(userResults.userResults);
		$httpBackend.when('POST', '/userapi').respond(userResults.userAddResult);
		$httpBackend.when('PUT', '/userapi').respond(userResults.userResults[0]);

		createController = function (params) {
			return $controller('UsersCtrl', params);
		};
	}));

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}),

describe('UsersCtrl', function () {

	var params, ctrl;

	beforeEach(function () {
		params = {
			$scope: $scope,
			LoginCtrlMethods: jasmine.createSpy('UsersCtrlMethods')
		};
		ctrl = createController(params);
	}),
	it('Injectables should be defined', function () {
		expect(params).toBeDefined();
		expect($scope).toBeDefined();
		expect(userService).toBeDefined();
		expect(userResults).toBeDefined();
		expect(userToAdd).toBeDefined();
		expect(userAddResult).toBeDefined();
	}),
	it('Should get all 6 users', function () {
		$scope.init();
		$httpBackend.flush();
		expect($scope.users.length).toBe(6);
	}),
	it('Active filter should return true', function () {
		expect($scope.activeFilter(userResults.userResults[1])).toBe(true);
	}),
	it('Active filter should return false', function () {
		expect($scope.activeFilter(userResults.userResults[0])).toBe(false);
	}),
	it('User search filter should return true', function () {
		$scope.usersSearchQuery = 'TheYeti';
		expect($scope.usersSearch(userResults.userResults[5])).toBe(true);
	}),
	it('User search filter should return false', function () {
		$scope.usersSearchQuery = 'TheYeti';
		for (var x = 0; x < 5; x++) {
			expect($scope.usersSearch(userResults.userResults[x])).toBe(false);
		}
	}),
	it('Should add a user', function () {
		spyOn($scope, 'refresh');
		$scope.addUserDialog.user.UserName = userToAdd.userToAdd.UserName,
		$scope.addUserDialog.user.Password = userToAdd.userToAdd.Password,
		$scope.addUserDialog.mrole = userToAdd.userToAdd.role,
		$scope.addUserDialog.Meta.Active = userToAdd.userToAdd.Active,
		$scope.addUserDialog.save();
		$httpBackend.flush();
		expect($scope.refresh).toHaveBeenCalled();
	}),
	it('Should update a user', function () {
		spyOn($scope, 'refresh');
		var userToUpdate = userResults.userResults[0];
		$scope.addUserDialog.user = userToUpdate,
		$scope.addUserDialog.role = userToUpdate.Roles[0],
		$scope.addUserDialog.Meta.Active = userToUpdate.Meta.Active,
		$scope.addUserDialog.update();
		$httpBackend.flush();
		expect($scope.refresh).toHaveBeenCalled();
	})
	;
	/*
	it('Login()', function () {
			$scope.UserName = 'user';
			$scope.Password = '123';
			$httpBackend.expectPOST('/auth').respond(201, '');
			$scope.login();
			$httpBackend.flush();
	});
	*/
});
});
