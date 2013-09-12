// Karma configuration
// Generated on Wed Aug 07 2013 20:15:45 GMT+0200 (West-Europa (zomertijd))

module.exports = function (config) {
	config.set({

		// base path, that will be used to resolve files and exclude
		basePath: '',


		// frameworks to use
		frameworks: ['jasmine'],


		// list of files / patterns to load in the browser
		files: [
			'../app/lib/angular/angular.js',
			'../app/lib/angular/*.js',
			'../app/lib/ui-bootstrap/ui-bootstrap-0.5.0.min.js',
			'../app/lib/ui-bootstrap/ui-bootstrap-tpls-0.5.0.min.js',
			'../tests/lib/angular/angular-mocks.js',
			'../app/lib/underscore/*.js',
			'../app/js/app.js',
			'../app/js/routingConfig.js',
			'../app/js/services/AuthService.js',
			'../app/js/services/UserService.js',
			'../app/js/services/LocalizationService.js',
			'../app/js/directives/AccessLevelDirective.js',
			'../app/js/directives/ActiveNavDirective.js',
			'../app/js/directives/AppDirectives.js',
			'../app/js/directives/LocalizationDirective.js',
			'../app/js/directives/LocalizationAttributeDirective.js',
			'../app/js/controllers/LoginCtrl.js',
			'../app/js/controllers/UsersCtrl.js',
			'../app/js/controllers/UserDetailCtrl.js',
			'../app/js/filters/LocalizationFilter.js',
			'../app/js/modules/DynamicLocale.js',
			'../tests/unit/MockData/*.js',
			'../tests/unit/*.js'
		],

		// list of files to exclude
		exclude: [


		],


		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress'],


		// web server port
		port: 9876,


		// enable / disable colors in the output (reporters and logs)
		colors: true,


		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,


		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,


		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera
		// - Safari (only Mac)
		// - PhantomJS
		// - IE (only Windows)
		browsers: ['Chrome'],


		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,


		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
