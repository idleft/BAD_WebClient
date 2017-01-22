app.controller('SubscriptionCtrl', ['$scope', '$window','$filter', 'SessionStorage', 'SubscriptionGetter', 'geolocationService','EmergenciesGetter'
    , function ($scope,$window, $filter, SessionStorage, SubscriptionGetter, geolocationService,EmergenciesGetter) {
		SessionStorage.conf();
        $scope.accessToken = SessionStorage.get('accessToken');
        $scope.userId = SessionStorage.get('userId');
		console.log("1deamaxwu ---> accessToken: "+$scope.accessToken +" userId: "+SessionStorage.get('userId'))
        $scope.chkbxs = EmergenciesGetter;

        $scope.params = [
            "Earthquake", "Hurricane", "Tornado", "Flood", "Shooting"
        ];

        $scope.mylocation = '';
        $scope.nearMe = false;
        //$scope.flag = false;
        //$scope.length = 0;
        $scope.isCheckAll = false;

        //var counter = 0;

        var emergencySuccessFunction = function(data) {
            console.log("1deamaxwu ---> all is well with subscriptions!");
            SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
            SessionStorage.set('timestamp', data['data']['timestamp']);
            //counter++;
            //console.log("counter:" + counter);
            //if(counter == $scope.length){
                $window.location.href = 'locationsubs.html';
            //}
        };

        var successFunction = function(data) {
			console.log("1deamxwu ---> subscription respond success");
            if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> subscriptioned success as "+data['data']['subscriptionId']);
            	SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
            	SessionStorage.set('timestamp', data['data']['timestamp']);
			}else{
				console.log("1deamaxwu ---> subscription ERROR: "+data['data']['error'])
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
        var errorFunction = function (data) {
            console.log("1deamaxwu ---> reponse ERROR: " + data['data']);
            $window.alert(data['data']);
            //$scope.flag = true;
        };

        function UserPosition(position) {
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.mylocation = {latitude: lat, longitude: lng};
            console.log("1deamxwu ---> get position latitude: " + lat+" longitude: "+lng);
        }
		$scope.onClickCheckAll = function () {
			console.log("1deamxwu ---> check/uncheck all items")
			for (chk in $scope.chkbxs){
				$scope.chkbxs[chk]["val"]=$scope.isCheckAll
			}

		};
        $scope.onClickNearMe = function () {
            if ($scope.nearMe) {
                var d = geolocationService.getCurrentPosition().then(UserPosition);
				var subscriptionList = getSubscriptionList();
                d.then(function() {
                    for(i = 0; i < subscriptionList.length; i++){
                        SubscriptionGetter.postEmergenciesAtLocationSubscription($scope.userId, $scope.mylocation,
                            $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                    }
                });
            }
        };

        $scope.subscribeToShelterInfo=function(){
            if($scope.shelterInfo) {
				var subscriptionList = getSubscriptionList();
                if (!$scope.nearMe) {
                    var d = geolocationService.getCurrentPosition().then(UserPosition);
                    d.then(function() {
                        for(i = 0; i < subscriptionList.length; i++) {
                            SubscriptionGetter.postEmergenciesLocationWithSheltersSubscription($scope.userId,
                                $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'),
                                successFunction, errorFunction)
                        }
                    });
                } else {
                    for(i = 0; i < subscriptionList.length; i++){
                        SubscriptionGetter.postEmergenciesLocationWithSheltersSubscription($scope.userId,
                            $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'),
                            successFunction, errorFunction)
                    }
                }
            }
        };


        function getSubscriptionList() {
            var subscriptionList = $filter('filter')($scope.chkbxs, {val: true});
            for (var i = 0; i < subscriptionList.length; i++) {
				console.log("1deamaxwu ---> subscriptionList item: "+subscriptionList[i].label);
                subscriptionList[i] = angular.lowercase(subscriptionList[i].label);
            }
            //$scope.length = subscriptionList.length;
            return subscriptionList;
        }

        $scope.subscribeToEmergencies = function () {
            var subscriptionList = getSubscriptionList();
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.userId = SessionStorage.get('userId');
            for(i = 0; i < subscriptionList.length; i++){
                var successFunctionUsed = successFunction;
                if(i == subscriptionList.length - 1) {
                    successFunctionUsed = emergencySuccessFunction
                }
                SubscriptionGetter.postEmergenciesSubscription($scope.userId, $scope.accessToken,
                    subscriptionList[i], SessionStorage.get('brokerUrl'), successFunctionUsed, errorFunction);
            }
        }
		$scope.logoutUser = function(){
			//$scope.dataStream.close();
			SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
			SessionStorage.remove();
		}
    }]
);
