app.controller('IndexController', ['$scope', 'IndexGetter', 'SessionStorage', function($scope, IndexGetter, SessionStorage) { 
	var successFunction = function(data) {
		console.log("SAFIR-->All is well!");
		console.log(data['data']['accessToken']);
		SessionStorage.set(data['data']['accessToken'])
	}

	var errorFunction = function(data) {
		console.log("Something went wrong: " + data);
	}

	$scope.userId = '';
	$scope.userPassword = '';

	$scope.loginUser = function(userId, userPassword) {
		$scope.isActive = true;
		$scope.userId = userId;
		$scope.userPassword = userPassword;
		IndexGetter.postUserData($scope.userId, $scope.userPassword, successFunction, errorFunction);
	};
}]);