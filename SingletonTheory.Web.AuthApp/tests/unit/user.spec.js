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
	var allUsersResponse;

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
		allUsersResponse = $injector.get('defaultJSON');

		//// backend definition common for all tests
		$httpBackend.when('GET', '/usersapi').respond(allUsersResponse);

		//$httpBackend.when('GET', '/roles').respond({
		//    "Roles": ["user"],
		//    "UserName": "user"
		//}, { 'A-Token': 'xxx' });

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
		expect(allUsersResponse).toBeDefined();
	}),
	it('Activite filter options should exist', function () {
		expect($scope.options).toBeDefined();
		expect($scope.options.activeFilterDescriptions.length).toBe(3);
		expect($scope.options.activeFilterDescriptions[0].value).toBe('');
		expect($scope.options.activeFilterDescriptions[0].text).toBe('All Users');
		expect($scope.options.activeFilterDescriptions[1].value).toBe('True');
		expect($scope.options.activeFilterDescriptions[1].text).toBe('Active Users');
		expect($scope.options.activeFilterDescriptions[2].value).toBe('False');
		expect($scope.options.activeFilterDescriptions[2].text).toBe('In-Active Users');
	}),
	it('Should get all 6 users', function () {
		$httpBackend.expectGET('/usersapi').respond(200, allUsersResponse.userResults);
		$scope.init();
		$httpBackend.flush();
		expect($scope.users.items.length).toBe(6);
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
