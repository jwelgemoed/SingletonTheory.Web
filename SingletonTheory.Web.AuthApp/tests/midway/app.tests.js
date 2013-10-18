describe('User Application Module: Midway Testing', function () {
	var module;
	beforeEach(function () {
		module = angular.module('user-application');
	});

	it('should be registered', function () {
		expect(module).not.toBe(undefined);
	});

	describe('Dependencies:', function () {
		var deps;
		var hasModule = function (m) {
			return deps.indexOf(m) >= 0;
		};
		beforeEach(function () {
			deps = module.value('user-application').requires;
		});

		it('should have ngResource as a dependency', function () {
			expect(hasModule('ngResource')).toEqual(true);
		});
		
		it('should have ngCookies as a dependency', function () {
			expect(hasModule('ngCookies')).toEqual(true);
		});
		
		it('should have ui.bootstrap as a dependency', function () {
			expect(hasModule('ui.bootstrap')).toEqual(true);
		});
		
		it('should have localization as a dependency', function () {
			expect(hasModule('localization')).toEqual(true);
		});
		
		it('should have dynamicLocaleModule as a dependency', function () {
			expect(hasModule('dynamicLocaleModule')).toEqual(true);
		});
		
		it('should have ngGrid as a dependency', function () {
			expect(hasModule('ngGrid')).toEqual(true);
		});
		
		it('should have st-breadcrumbs as a dependency', function () {
			expect(hasModule('st-breadcrumbs')).toEqual(true);
		});
		
		it('should have angularTreeview as a dependency', function () {
			expect(hasModule('angularTreeview')).toEqual(true);
		});
		
	});
});

describe('Dynamic Locale Module: Midway Testing', function () {
	var module;
	beforeEach(function () {
		module = angular.module('dynamicLocaleModule');
	});

	it('should be registered', function () {
		expect(module).not.toBe(undefined);
	});
});

describe('Localization Module: Midway Testing', function () {
	var module;
	beforeEach(function () {
		module = angular.module('localization');
	});

	it('should be registered', function () {
		expect(module).not.toBe(undefined);
	});
	
	describe('Dependencies:', function () {
		var deps;
		var hasModule = function (m) {
			return deps.indexOf(m) >= 0;
		};
		beforeEach(function () {
			deps = module.value('localization').requires;
		});

		it('should have ngResource as a dependency', function () {
			expect(hasModule('ngResource')).toEqual(true);
		});

	});
});

describe('Testing Routes', function() {

	it('should have a route for the Home URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/'].templateUrl).toBe('/partials/home.html');
			expect($route.routes['/'].controller).toBe('HomeCtrl');
			expect($route.routes['/'].access).toBe('General_Access');
		});
	});
	
	it('should have a route for the Login URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/login'].templateUrl).toBe('/partials/login.html');
			expect($route.routes['/login'].controller).toBe('LoginCtrl');
			expect($route.routes['/login'].access).toBe('Guest_Access');
		});
	});
	
	it('should have a route for the User Admin URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/useradmin'].templateUrl).toBe('/partials/useradmin.html');
			expect($route.routes['/useradmin'].controller).toBe('UserAdminCtrl');
			expect($route.routes['/useradmin'].access).toBe('UserAdministration_Access');
		});
	});
	
	it('should have a route for the Auth Admin URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/auth/authadmin'].templateUrl).toBe('/partials/authadmin.html');
			expect($route.routes['/auth/authadmin'].controller).toBe('AuthAdminCtrl');
			expect($route.routes['/auth/authadmin'].access).toBe('AuthorizationAdministration_Access');
		});
	});
	
	it('should have a route for the Locale Admin URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/auth/localeadmin'].templateUrl).toBe('/partials/localeadmin.html');
			expect($route.routes['/auth/localeadmin'].controller).toBe('LocaleAdminCtrl');
			expect($route.routes['/auth/localeadmin'].access).toBe('LocalizationAdministration_Access');
		});
	});
	
	it('should have a route for the 404 Error URI', function () {
		module('user-application');

		inject(function ($route) {
			expect($route.routes['/404'].templateUrl).toBe('/partials/404.html');
			expect($route.routes['/404'].access).toBe('General_Access');
		});
	});

});