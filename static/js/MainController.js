app.controller('MainController', ['$scope', '$interval', 'HttpGetter', 'SessionStorage', function($scope, 
	$interval, HttpGetter, SessionStorage) {

	var newResultSuccessFunction = function(data) {
		$scope.newContent = data;
		console.log($scope.newContent);
	}

	var newResultErrorFunction = function(data) {
		console.log("Something went wrong while fetching new results: " + data);
	}

	var successFunction = function(data) {
		$scope.data = data;
		console.log($scope.data)
		if($scope.data['status'] == 'success' && $scope.data['fire'] == 'true') {
			HttpGetter.getNewResults(newResultSuccessFunction, newResultErrorFunction);
		}
	}

	var errorFunction = function(data) {
		console.log("Something went wrong: " + data);
	}

	//755848c9-8b02-fe51-4cee-9010c8df6414

	var timeVariable;

	$scope.pollFunction = function() {
		HttpGetter.pollBroker(successFunction, errorFunction);
	}

	$scope.init = function() {
		console.log('SAFIR-->Starting timer');
		timeVariable = $interval(function(){ $scope.pollFunction(); }, 5000);
	}

}]);