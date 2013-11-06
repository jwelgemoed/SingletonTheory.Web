'use strict';

userApplicationModule.controller('BookedHoursInputCtrl',
	['$rootScope', '$scope','$timeout', 'localize', 'AuthService',
		function ($rootScope, $scope,$timeout, localize, AuthService) {
			//DatePickers ----------

			$scope.dateOptions = {
				'year-format': "'yy'",
				'starting-day': 1
			};

			$scope.openDtStart = function () {
				$timeout(function () {
					$scope.openedDtStart = true;
				});
			};

			$scope.openDtEnd = function () {
				if ($scope.useEndDate) {
					$timeout(function () {
						$scope.openedDtEnd = true;
					});
				}
			};
		}]);