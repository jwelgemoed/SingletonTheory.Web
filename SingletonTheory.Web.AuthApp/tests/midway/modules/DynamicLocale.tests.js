//describe("Midway: Testing Requests", function() {

//	var test, onChange;
//	var $httpBackend;

//	beforeEach(inject(function ($injector) {
//		$httpBackend = $injector.get('$httpBackend');
		
//		$httpBackend.when('GET', '/authapi/currentuser').respond('Hello');
//	}));

//	beforeEach(function () {
	

//		ngMidwayTester.register('user-application', function (instance) {
//			test = instance;
//			test.$rootScope.$on('$routeChangeSuccess', function () {
//		//	alert(onChange);
//				if (onChange) onChange();
//			});
		
//		});
		
		
//	});

//	it("should goto the videos_path by default", function () {
//		onChange = function () {
//	//		alert(test.view().innerHTML);
//			expect(test.view().innerHTML).to.contain('app-youtube-listings');
//		};
//	//	alert(test);
		
//		test.path('/');
//	});

//});