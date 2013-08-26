// This is a file for custom AngularJS Scenario methods.

angular.scenario.dsl('value', function () {
	return function (value) {
		return this.addFuture('value to future', function (done) {
			done(null, value);
		});
	};
});

//it('should equal 42 - Displays how to add custom extensions', function () {
//	expect(value(42)).toBe(42);
//});