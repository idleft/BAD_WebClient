app.controller('PreferenceController', ['$scope', '$window', '$filter', 'PreferenceGetter', 'SessionStorage', 
	function($scope, $window, $filter, PreferenceGetter, SessionStorage) { 
		SessionStorage.conf();
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.userId = SessionStorage.get('userId');
		$scope.chkbxs = [];

	var successFunction = function(data) {
		console.log("1deamxwu ---> subscribe channel respond success");
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> subscribed channel success as userSubscriptionId: "+data['data']['userSubscriptionId']);
			SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
			SessionStorage.set('timestamp', data['data']['timestamp']);

			$window.location.href = 'notifications.html';
		}else{
			console.log("1deamaxwu ---> subscribe channel ERROR: "+data['data']['error'])
			$window.alert(data['data']['error']);		
		}	
		
	}
	var logoutSuccessFunction = function (data) {
            console.log("1deamxwu ---> logout respond success");
			if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> logged out success as "+data['data']['userId']);
			}else{
				console.log("1deamaxwu ---> logged out ERROR: "+data['data']['error'])
			}
        }
	var errorFunction = function(data) {
		console.log("1deamxwu ---> respond ERROR: " + data['data']);
		$window.alert(data['data']['error']);
	}

	var channelListSuccessFuction = function(data) {
		console.log("1deamxwu ---> get channellist respond success");
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> got channellist success as "+data['data']['channels']);
			var i=0;
			for(obj in data['data']["channels"])
			{
				$scope.chkbxs.push({channel:data['data']["channels"][i]["ChannelName"],val:false,label:''});
				i++;
			}
		}else{
			console.log("1deamaxwu ---> register user ERROR: "+data['data']['error'])
			$window.alert(data['data']['error']);		
		}
	}


	$scope.getChannels = function(){
		$scope.isActive = true;
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.userId = SessionStorage.get('userId');
		PreferenceGetter.getChannelList($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), channelListSuccessFuction,errorFunction);
	};

	$scope.subscribeToNotifications = function() {
		$scope.isActive = true;
		var subscriptionList = $filter("filter")( $scope.chkbxs , {val:true} );
		for (var i = 0; i < subscriptionList.length; i++) {
			subscriptionList[i] = subscriptionList[i].label;
			console.log("1deamaxwu ---> subscriptionList item: "+subscriptionList[i]);
		}
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.userId = SessionStorage.get('userId');

		PreferenceGetter.postSubscription($scope.userId, $scope.accessToken, subscriptionList, SessionStorage.get('brokerUrl'),
			successFunction, errorFunction);

	};
	$scope.logoutUser = function () {
        //$scope.dataStream.close();
		PreferenceGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        SessionStorage.remove();
    };

}]);
