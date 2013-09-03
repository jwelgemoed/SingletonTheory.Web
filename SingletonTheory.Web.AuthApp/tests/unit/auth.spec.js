/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="../../app/lib/angular/angular.js" />
/// <reference path="../../app/lib/angular/angular-cookies.js" />
/// <reference path="../lib/angular/angular-mocks.js" />
/// <reference path="../../app/js/app.js" />
/// <reference path="../../app/js/services/AuthService.js" />
/// <reference path="../../app/js/services/UserService.js" />
/// <reference path="../../app/js/routingConfig.js" />
/// <reference path="../../app/js/controllers/LoginCtrl.js" />
/// <reference path="~/tests/unit/MockData/LocalizationMockData.js" />
/// <reference path="~/tests/unit/MockData/UsersMockData.js" />

describe('Authentication', function () {

	var $scope;
	var $location;
	var $window;
	var $controller;
	var $httpBackend;
	var authService;
	var enUS;
	var user;


	//you need to indicate your module in a test
	beforeEach(module(userApplicationModule.name, mockLocalizationData.name, mockUserData.name));

	beforeEach(inject(function ($injector) {
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		$scope = $injector.get('$rootScope');
		$location = $injector.get('$location');
		$window = $injector.get('$window');
		$controller = $injector.get('$controller');
		authService = $injector.get('AuthService');
		enUS = $injector.get('en-US');
		user = $injector.get('userAddResult');

		// backend definition common for all tests
		$httpBackend.when('POST', '/authapi').respond({
			UserId: '1',
			UserName: 'user',
			FirstName: 'Hello',
			Surname: 'User'
		}, { 'A-Token': 'xxx' });

		$httpBackend.when('GET', '/rolesapi').respond(user.userAddResult[0]);

		$httpBackend.when('GET', '/localize/en-US').respond(enUS.enUS[0]);
		
		createController = function (params) {
			return $controller('LoginCtrl', params);
		};
	}));

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		//$httpBackend.verifyNoOutstandingRequest();
	}),

	describe('LoginCtrl', function () {

		var params, ctrl;

		beforeEach(function () {
			params = {
				$scope: $scope,
				LoginCtrlMethods: jasmine.createSpy('LoginCtrlMethods')
			};
			ctrl = createController(params);
		}),
		it('Injectables should be defined', function () {
			expect(params).toBeDefined();
			expect($scope).toBeDefined();
			expect(authService).toBeDefined();
			expect(enUS).toBeDefined();
		}),
		it('Login()', function () {
			$scope.UserName = 'user';
			$scope.Password = '123';
			$httpBackend.expectPOST('/authapi').respond(201, '');
			$scope.login();
			$httpBackend.flush();
		});
	});

});
