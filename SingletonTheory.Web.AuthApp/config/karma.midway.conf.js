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
			'../app/lib/jquery/jquery-1.10.2.min.js',
			'../app/lib/angular/angular.min.js',
			'../app/lib/angular/angular-cookies.min.js',
			'../app/lib/angular/angular-resource.min.js',
			'../app/lib/ui-bootstrap/ui-bootstrap-tpls-0.6.0.min.js',
			'../app/lib/angular/ng-grid/ng-grid.js',
			'../app/lib/angular/treeview/angular.treeview.min.js',
			'../app/lib/jasmine/jasmine.js',
			'../tests/lib/angular/ngMidwayTester.js',
			'../tests/lib/angular/angular-mocks.js',
			'../app/lib/jquery/jquery-1.10.2.min.js',
			

			'../app/js/app.js',
			'../app/js/routingConfig.js',
			'../app/js/modules/*.js',
			'../app/js/controllers/*.js',
			'../app/js/directives/*.js',
			'../app/js/filters/*.js',
			
			'../app/js/services/*.js',
			'../tests/midway/*.js',
			'../tests/midway/controllers/*.js',
			'../tests/midway/directives/*.js',
			'../tests/midway/filters/*.js',
			'../tests/midway/modules/*.js',
			'../tests/midway/services/*.js'
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
