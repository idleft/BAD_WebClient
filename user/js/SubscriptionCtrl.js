app.controller('SubscriptionCtrl', ['$scope', '$window', '$filter', 'SessionStorage', 'SubscriptionGetter', 'geolocationService', 'EmergenciesGetter', function($scope, $window, $filter, SessionStorage, SubscriptionGetter, geolocationService, EmergenciesGetter) {
    SessionStorage.conf();
    $scope.accessToken = SessionStorage.get('accessToken');
    $scope.userId = SessionStorage.get('userId');
    console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('userId'))
    $scope.chkbxs = EmergenciesGetter.emergencytpye;
    //$scope.sublist = EmergenciesGetter.subsrcibtionlist;
	$scope.sublist = []
	
    $scope.mylocation = '';
    $scope.locselection = "";
    $scope.shelterInfo = false;

    $scope.map = {
        center: {
            latitude: 40.1451,
            longitude: -99.6680
        },
        zoom: 7
    };
    $scope.options = {
        scrollwheel: false
    };
    $scope.address = '';
    $scope.control = {};
    $scope.addresses = [];
    $scope.markers = [];
    var bounds = new google.maps.LatLngBounds();

    var searchAddressInput = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(searchAddressInput);

    $scope.addLocation = function() {
        console.log("1deamaxwu ---> addding location");
        var geocoder = new google.maps.Geocoder();
        geocoder.geocode({
            "address": $scope.address
        }, function(results, status) {
            var address = $scope.address;
            if (status == google.maps.GeocoderStatus.OK) {
                $scope.addresses.push($scope.address);
                //$scope.$apply();
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: results[0].geometry.location.lat(),
                        longitude: results[0].geometry.location.lng()
                    },
                    title: address
                };
                $scope.markers.push(marker);
                $scope.address = '';
                console.log("1deamaxwu ---> Add a new location: " + marker.coords.latitude + "," + marker.coords.longitude);
                for (var i = 0, length = $scope.markers.length; i < length; i++) {
                    var marker = $scope.markers[i].coords;
                    console.log("test: " + marker.latitude + ',' + marker.longitude)
                    bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
                }
                $scope.control.getGMap().fitBounds(bounds);
                //$scope.$apply();
            } else {
                console.log("1deamaxwu ---> Geocode was not successful for the following reason: " + status);
                $window.alert("1deamaxwu ---> Geocode was not successful for the following reason: " + status);
            }
        });
    }
    $scope.nearMe = function() {
        if ($scope.locselection == "NearMe") {
        	$scope.addresses = [];
        	$scope.markers = [];
        	
        	//$scope.$apply();
            console.log("1deamaxwu ---> getting my location...");
            //var d = geolocationService.getCurrentPosition().then(UserPosition);
            UserPosition();
            //d.then(function() {
                console.log("1deamaxwu ---> my location:" + $scope.mylocation)
                console.log("1deamaxwu ---> lat:" + $scope.mylocation.latitude + ",lng:" + $scope.mylocation.longitude + ".");
                var marker = {
                    id: Date.now(),
                    coords: {
                        latitude: $scope.mylocation.latitude,
                        longitude: $scope.mylocation.longitude
                    },
                    title: "myloc"
                };
                $scope.markers.push(marker);
                //bounds.extend(new google.maps.LatLng($scope.mylocation.latitude, $scope.mylocation.longitude)); 
                bounds.extend(new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude));
                $scope.control.getGMap().fitBounds(bounds);
                //$scope.$apply();
            //});

        }
        if ($scope.locselection == "Location") {
        	$scope.addresses = [];
    		$scope.markers = [];
        }
    }

    var successFunction = function(data) {
        console.log("1deamxwu ---> subscription respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> subscriptioned success as " + data['data']['userSubscriptionId']);
            SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
            SessionStorage.set('timestamp', data['data']['timestamp']);
            $window.alert("Subscribed!");
        } else {
            console.log("1deamaxwu ---> subscription ERROR: " + data['data']['error'])
            $window.alert(data['data']['error']);
        }
    }
    var logoutSuccessFunction = function(data) {
        console.log("1deamxwu ---> logout respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
            SessionStorage.remove();
            $window.location.href = 'index.html';
        } else {
            console.log("1deamaxwu ---> logged out ERROR: " + data['data']['error'])
        }
    }
    var subscribeSuccessFunction = function (data) {
            console.log("1deamxwu ---> get subscribtion respond success");
			if(data['data']['status']=='success'){ 
				console.log("1deamaxwu ---> got subcribtion success as "+data['data']['subscriptions']);

				if(SessionStorage.get("subscriptionId")!=null){SessionStorage.removeElement("subscriptionId");$scope.sublist=[]}
				if(data['data']['subscriptions'] !=null){
            		for (var i = 0; i < data['data']['subscriptions'].length; i++) {
                		SessionStorage.set('subscriptionId', data['data']['subscriptions'][i]["userSubscriptionId"]);
                		if (-1==$scope.sublist.indexOf(data['data']['subscriptions'][i]["channelName"])){
                			$scope.sublist.push(data['data']['subscriptions'][i]["channelName"]);
                		}
           			}
				}
			}else{
				console.log("1deamaxwu ---> subscribe ERROR: "+data['data']['error'])		
			}

        };
    var errorFunction = function(data) {
        console.log("1deamaxwu ---> reponse ERROR: " + data['data']);
        $window.alert(data['data']);
    };

    function UserPosition() {
        //var lat = position.coords.latitude;
        //var lng = position.coords.longitude;
        
        
        var baselat = 33.64295;
            var baselng = -117.841377;


            var uname = SessionStorage.get('userName')
            if (uname == "Rose") {
                baselat = 33.9459957;
                baselng = -117.4695675;
            } else if (uname == "Adam") {
                baselat = 30.3076863;
                baselng = -97.8934839;
            } else if (uname == "Walt") {
                baselat = 38.8993277;
                baselng = -77.0846059;
            } else if (uname == "Will") {
                baselat = 38.8993277;
                baselng = -77.0846059;
            } else {
                console.log("1deamaxwu ---> undefault location.")
            }
            console.log("1deamaxwu ---> location: (" + baselat + ',' + baselng + ')')

            var lat = baselat + Math.random();
            var lng = baselng + Math.random();
        
        
        $scope.mylocation = {
            latitude: lat,
            longitude: lng
        };
        console.log("1deamxwu ---> get position latitude: " + lat + " longitude: " + lng);
    }

    function getSubscriptionList() {
        var subscriptionList = $filter('filter')($scope.chkbxs, {
            val: true
        });
        for (var i = 0; i < subscriptionList.length; i++) {
            console.log("1deamaxwu ---> subscriptionList item: " + subscriptionList[i].label);
            subscriptionList[i] = angular.lowercase(subscriptionList[i].label);
        }
        return subscriptionList;
    }

    $scope.subscribeToEmergencies = function() {
        console.log("1deamxwu ---> Location: " + $scope.locselection + "shelterInfo: " + $scope.shelterInfo)
        var subscriptionList = getSubscriptionList();
        if (subscriptionList.length == 0) {
            $window.alert("Please Select A Type!");
        }
        $scope.accessToken = SessionStorage.get('accessToken');
        $scope.userId = SessionStorage.get('userId');


		// shelter, location and type
        if ($scope.shelterInfo) {
            if ($scope.locselection != "") {
            
				//recentIptMsgofEmergenciesOfTypeWithShelterIntUserChannel
                if ($scope.locselection == "NearMe") {
                    console.log("1deamxwu ---> SHELTER and NEARME and TYPE.")
                    //var d = geolocationService.getCurrentPosition().then(UserPosition);
                    UserPosition();
                    var subscriptionList = getSubscriptionList();
                    //d.then(function() {
                        for (i = 0; i < subscriptionList.length; i++) {
                            SubscriptionGetter.postIptMsgofEmergenciesOfTypeWithShelterIntUserSubscription($scope.userId, $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                        }
                    //});
                    
                  //recentEmergenciesOfTypeAtLocationWithShelterchannel
                } else if ($scope.locselection == "Location") {
                    console.log("1deamxwu ---> SHELTER and LOCATION and TYPE.")
                    if ($scope.markers.length == 0) {
                        $window.alert("Please Add a Location!")
                    }
                    for (var j = 0, length = $scope.markers.length; j < length; j++) {
                        var marker = $scope.markers[j].coords;
                        for (i = 0; i < subscriptionList.length; i++) {
                            SubscriptionGetter.postEmergenciesLocationWithShelterSubscription($scope.userId, marker, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                        }
                    }
                } else {
                    console.log("1deamxwu ---> some implicit error.")
                }
            } else {
                console.log("1deamxwu ---> SHELTER without LOCATION.")
                $window.alert("Shelter without Location!")
            }
            
        //location and type
        } else if ($scope.locselection != "") {
        
			//recentIptMsgofEmergenciesOfTypeIntUserChannel
            if ($scope.locselection == "NearMe") {
                console.log("1deamxwu ---> NEARME and TYPE.")
                //var d = geolocationService.getCurrentPosition().then(UserPosition);
                UserPosition();
                var subscriptionList = getSubscriptionList();
                //d.then(function() {
                    for (i = 0; i < subscriptionList.length; i++) {
                        SubscriptionGetter.postIptMsgofEmergenciesOfTypeIntUserSubscription($scope.userId, $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                    }
                //});
              
              //recentEmergenciesOfTypeAtLocationChannel
            } else if ($scope.locselection == "Location") {
                console.log("1deamxwu ---> LOCATION and TYPE.")
                if ($scope.markers.length == 0) {
                    $window.alert("Please Add a Location!")
                }
                for (var j = 0, length = $scope.markers.length; j < length; j++) {
                    var marker = $scope.markers[j].coords;
                    for (i = 0; i < subscriptionList.length; i++) {
                        SubscriptionGetter.postEmergenciesAtLocationSubscription($scope.userId, marker, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                    }
                }
            } else {
                console.log("1deamxwu ---> some implicit error.")
            }
            
        //just type    
          //recentEmergenciesOfTypeChannel
        } else {
            console.log("1deamxwu ---> JUST TYPE.")
            for (i = 0; i < subscriptionList.length; i++) {
                SubscriptionGetter.postEmergenciesSubscription($scope.userId, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction);
            }
        }

    }
    $scope.logoutUser = function() {
        SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        
    }
    $scope.init = function () {
            SubscriptionGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), 
                subscribeSuccessFunction, errorFunction);
        }
}]);
