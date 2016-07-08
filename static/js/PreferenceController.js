app.controller('PreferenceController', ['$scope', '$window', '$filter', 'PreferenceGetter', 'SessionStorage', 
	function($scope, $window, $filter, PreferenceGetter, SessionStorage) { 
	var successFunction = function(data) {
		console.log("SAFIR-->All is well with subscriptions!");

		SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
		SessionStorage.set('timestamp', data['data']['timestamp']);

		//SessionStorage.set('accessToken', data['data']['accessToken']);
		$window.location.href = '/notifications';
	}

	var errorFunction = function(data) {
		console.log("Something went wrong: " + data);
	}

	$scope.chkbxs = [{label:"Dead", val:false }];

	$scope.subscribeToNotifications = function() {
		$scope.isActive = true;
		var subscriptionList = $filter("filter")( $scope.chkbxs , {val:true} );
		for (var i = 0; i < subscriptionList.length; i++) {
			subscriptionList[i] = subscriptionList[i].label;
		}
		console.log(subscriptionList);
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.userId = SessionStorage.get('userId');

		PreferenceGetter.postSubscription($scope.userId, $scope.accessToken, subscriptionList, 
			successFunction, errorFunction);

	};

}]);