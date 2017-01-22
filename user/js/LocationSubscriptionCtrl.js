app.controller('LocationSubscriptionCtrl',['$scope','$filter','$window', 'SessionStorage', 'SubscriptionGetter','EmergenciesGetter',function($scope,$filter,$window,SessionStorage,SubscriptionGetter,EmergenciesGetter){
	SessionStorage.conf();
    $scope.accessToken = SessionStorage.get('accessToken');
    $scope.userId = SessionStorage.get('userId');
    $scope.map = {center: {latitude: 40.1451, longitude: -99.6680 }, zoom: 7 };
    $scope.chords={latitude: 40.1451, longitude: -99.6680 };
    $scope.options = {scrollwheel: false};
    $scope.address='';
    $scope.control= {};
    $scope.addresses=[];
    $scope.markers=[];
    $scope.length=0;
    $scope.chkbxs = EmergenciesGetter;
    var bounds = new google.maps.LatLngBounds();
    var counter = 0;

    //console.log("chkbxs:"+$scope.chkbxs);
    var searchAddressInput = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(searchAddressInput);

    var emergencySuccessFunction = function(data) {
        console.log("1deamaxwu ---> all is well with subscriptions");
		if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> subscriptioned success as "+data['data']['subscriptionId']);
        		SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
        		SessionStorage.set('timestamp', data['data']['timestamp']);

			counter++;
        	if(counter == $scope.length*$scope.markers.length){
            	$window.location.href = 'notifications.html';
        	}
		}else{
				console.log("1deamaxwu ---> subscription ERROR: "+data['data']['error'])
				$window.alert(data['data']['error']);			
		}

    };
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

        $scope.flag=true;
    };


    function getSubscriptionList() {
        //console.log("In getSubscriptionList");
        var subscriptionList = $filter('filter')($scope.chkbxs, {val: true});
        //console.log("Just testing filter"+subscriptionList);
        for (var i = 0; i < subscriptionList.length; i++) {
            subscriptionList[i] = angular.lowercase(subscriptionList[i].label);
			console.log("1deamaxwu ---> subscriptionList item: "+subscriptionList[i].label);
            //console.log("the list "+subscriptionList[i]);
        }
        $scope.length = subscriptionList.length;
        //console.log("length of subscriptionList:"+$scope.length);
        return subscriptionList;

    }
    $scope.addLocation = function(){
        console.log("1deamaxwu ---> addding location");
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode( { "address": $scope.address }, function(results, status) {
            //console.log($scope.address);
            var address =$scope.address;
            if (status == google.maps.GeocoderStatus.OK)
            {
                //console.log(results[0].geometry.location.lng());
                $scope.addresses.push($scope.address);
                $scope.$apply();
                $scope.address='';
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    },
                    title: address
                };
                $scope.markers.push(marker);
                //console.log($scope.markers.coords);
                for (var i = 0, length = $scope.markers.length; i < length; i++) {
                    var marker = $scope.markers[i].coords;
                    console.log(marker);
                    bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
                }
                $scope.control.getGMap().fitBounds(bounds);
                $scope.$apply();
            }
            else
            {
				console.log("1deamaxwu ---> Geocode was not successful for the following reason: " + status);
                $window.alert("1deamaxwu ---> Geocode was not successful for the following reason: " + status);
            }
        });
    }


    $scope.subscribeToLocations = function () {
        var subscriptionList = getSubscriptionList();
        for (var j = 0, length = $scope.markers.length; j < length; j++) {
            var marker = $scope.markers[j].coords;
            //console.log("marker:"+ marker);
            for (i = 0; i < subscriptionList.length; i++) {
                //console.log("Subscribing for:" + subscriptionList[i]);
                SubscriptionGetter.postEmergenciesAtLocationSubscription($scope.userId, marker,
                    $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), emergencySuccessFunction, errorFunction)
            }
        }

    };
	$scope.logoutUser = function(){
			//$scope.dataStream.close();
			SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
			SessionStorage.remove();
		}

}]);
