/// <reference path="../../app/js/services/LocalizationService.js" />
/// <reference path="~/tests/lib/jasmine/jasmine.js" />
/// <reference path="~/tests/unit/MockData/LocalizationMockData.js" />
/// <reference path="~/app/lib/angular/angular.js" />
/// <reference path="~/tests/lib/angular/angular-mocks.js" />
/// <reference path="~/app/js/app.js" />

describe('Localization', function () {
	var enUS;
	var nlnl;
	var defval;
	var $httpBackend;

	beforeEach(angular.mock.module(localizationModule.name, mockLocalizationData.name));

	beforeEach(inject(function ($injector) {

		$httpBackend = $injector.get('$httpBackend');
		enUS = $injector.get('en-US');
		nlnl = $injector.get('nl-nl');
		defval = $injector.get('default');

		//// backend definition common for all tests
		$httpBackend.when('GET', '/localize/en-US').respond(enUS.enUS[0]);
		$httpBackend.when('GET', '/localize/nl-nl').respond(nlnl.nlnl[0]);
		$httpBackend.when('GET', '/localize/default').respond(defval.defval[0]);
		$httpBackend.when('GET', '/localize/somestrangelanguage').respond(defval.defval[0]);
		//$httpBackend.when('POST', '/userapi').respond(userResults.userAddResult);
		//$httpBackend.when('PUT', '/userapi').respond(userResults.userResults[0]);

	}));
	afterEach(function () {
		$httpBackend.verifyNoOutstandingExpectation();
		$httpBackend.verifyNoOutstandingRequest();
	}),
	describe("Unit: Testing localization service", function () {
		it('Injectables should be defined', function() {
			expect(enUS).toBeDefined();
		}),
		it('should contain a localize service', inject(function(localize) {
			expect(localize).toBeDefined();
			$httpBackend.flush();
		})),
		it('should have a working localize service', inject(['localize', function(localize) {
			expect(localize.language).toBeDefined();
			expect(localize.dictionary).toBeDefined();
			expect(localize.resourceFileLoaded).toBeDefined();
			expect(localize.setLanguage).toBeDefined();
			expect(localize.initLocalizedResources).toBeDefined();
			expect(localize.getLocalizedString).toBeDefined();
			$httpBackend.flush();
		}])),
		it('should have a working service that returns english', inject(['localize', function(localize) {
			localize.setLanguage('en-US');
			$httpBackend.flush();
			var translatedValue = localize.getLocalizedString('_TestTitle_');
			expect(translatedValue).toBe('This comes from the English US file.');
		}])),
		it('should have a working service that returns dutch', inject(['localize', function(localize) {
			localize.setLanguage('nl-nl');
			$httpBackend.flush();
			var translatedValue = localize.getLocalizedString('_TestTitle_');
			expect(translatedValue).toBe('Deze komen van de Nederlandse bestand.');
		}])),
		it('should have a working service that returns the default on request', inject(['localize', function(localize) {
			localize.setLanguage('default');
			$httpBackend.flush();
			var translatedValue = localize.getLocalizedString('_TestTitle_');
			expect(translatedValue).toBe('This comes from the default file.');
		}])),
		it('should have a working service that returns the default on unknown', inject(['localize', function(localize) {
			localize.setLanguage('somestrangelanguage');
			$httpBackend.flush();
			var translatedValue = localize.getLocalizedString('_TestTitle_');
			expect(translatedValue).toBe('This comes from the default file.');
		}]));
	});
});