/// <reference path="../lib/jasmine/jasmine.js" />
/// <reference path="../../app/lib/angular/angular.js" />
/// <reference path="../../app/lib/angular/angular-cookies.js" />
/// <reference path="../lib/angular/angular-mocks.js" />
/// <reference path="../../app/js/app.js" />
/// <reference path="../../app/js/services/AuthService.js" />
/// <reference path="../../app/js/services/UserServices.js" />
/// <reference path="../../app/js/routingConfig.js" />
/// <reference path="../../app/js/controllers/LoginCtrl.js" />

describe('Authentication', function () {

	var $scope;
	var $location;
	var $window;
	var $controller;
	var $httpBackend;
	var authService;

	//you need to indicate your module in a test
	beforeEach(userApplicationModule);

	beforeEach(inject(function ($injector) {
		// Set up the mock http service responses
		$httpBackend = $injector.get('$httpBackend');
		$scope = $injector.get('$rootScope');
		$location = $injector.get('$location');
		$window = $injector.get('$window');
		$controller = $injector.get('$controller');
		authService = $injector.get('AuthService');

		// backend definition common for all tests
		$httpBackend.when('POST', '/authapi').respond({
			UserId: '1',
			UserName: 'user',
			FirstName: 'Hello',
			Surname: 'User'
		}, { 'A-Token': 'xxx' });

		$httpBackend.when('GET', '/rolesapi').respond({
			"Roles":["user"],
			"UserName":"user"}, { 'A-Token': 'xxx' });

		createController = function (params) {
			return $controller('LoginCtrl', params);
		};
	}));

	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
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
			//expect(ctrl).toBeDefined();
			expect(params).toBeDefined();
			expect($scope).toBeDefined();
			expect(authService).toBeDefined();
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