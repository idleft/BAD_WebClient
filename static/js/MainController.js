app.controller('MainController', ['$scope', '$interval', '$websocket', '$window', '$location', 'HttpGetter',
    'SessionStorage','geolocationService', function($scope, $interval, $websocket, $window, $location, HttpGetter, SessionStorage, geolocationService) {
		SessionStorage.conf();
        $scope.messages = [];
        $scope.msgChannelName = '';
        var count = 0;

        //Map Integration
        $scope.map = {center: {latitude: 40.1451, longitude: -99.6680}, zoom: 7};
        $scope.options = {scrollwheel: false};
        $scope.markers = [];
        $scope.control= {};
        var bounds = new google.maps.LatLngBounds();


        $scope.renderMap = function() {
            console.log("1deamaxwu ---> rendering map");

            for (var i = 0, length = $scope.markers.length; i < length; i++) {
                var marker = $scope.markers[i].coords;
                bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
            }
            $scope.control.getGMap().fitBounds(bounds);

        }
		var acksuccessFunction = function (data) {
            console.log("1deamxwu ---> ackresults respond success");
			if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> acked results success as "+data['data']['status']);
			}else{
				console.log("1deamaxwu ---> ackresults ERROR: "+data['data']['error'])
			}
        }

        var successFunction = function (data) {
            console.log("1deamaxwu ---> all is well with new results");

			HttpGetter.ackResults($scope.userId, $scope.accessToken, $scope.ackUserSubscriptionId,
                        $scope.latestTimeStamp, $scope.ackChannelName, SessionStorage.get('brokerUrl'), acksuccessFunction, errorFunction);

            $scope.messages.reverse();

            if (data['data']['results'] != null) {

                for (i = 0; i < data['data']['results'].length; i++) {
					iz=data['data']['results'][i]['result']['impactZone']
                    var message = {
                        'emergencytype': data['data']['results'][i]['emergencyType'],
                        'severity': data['data']['results'][i]['severity'],
                        'center': {latitude: iz[0][0], longitude: iz[0][1]},
                        'coordinates': iz[0][0] + "," + iz[0][1],
                        'radius': iz[1],
                        'message': data['data']['results'][i]['message'],
                        'timestamp': data['data']['results'][i]['timestamp'],
                        'msgChannelName': data['data']['channelName']
                    }
                    $scope.messages.push(message);
                    var marker = {
                        id: Date.now(),
                        coords: {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        message: message
                    };
                    $scope.markers.push(marker);
                }
            }
            $scope.messages.reverse();
        }
        // function UserPosition(position) {
            function UserPosition() {
            console.log("1deamaxwu ---> interval as UserPosition")

            // var lat = position.coords.latitude;
            // var lng = position.coords.longitude;
            var lat = 33.6404952;
            var lng = -117.8464902;
            var portNo = 10003;
            Date.now = function(){
                return  new Date().getTime();
            }
            $scope.mylocation = {latitude: lat, longitude: lng};
            var record =[{
                'recordId': Date.now(),
                'user-id' : SessionStorage.get('userId'),
                'latitude' : lat,
                'longitude' : lng,
                'timeoffset': 60.0,
                'timestamp' : JSON.stringify(Date.now())
            }];
            HttpGetter.feedRecords($scope.userId, $scope.accessToken, portNo,
                record, SessionStorage.get('brokerUrl'), userSuccessFunction, errorFunction);
        }
        $interval(function(){
            //UserPosition();
        },10000);


        var subscribeSuccessFunction = function (data) {
            console.log("1deamxwu ---> get subscribtion respond success");
			if(data['data']['status']=='success'){ 
				console.log("1deamaxwu ---> got subcribtion success as "+data['data']['subscriptions']);

				if(SessionStorage.get("subscriptionId")!=null){SessionStorage.removeElement("subscriptionId");}
				if(data['data']['subscriptions'] !=null){
            		for (var i = 0; i < data['data']['subscriptions'].length; i++) {
                		SessionStorage.set('subscriptionId', data['data']['subscriptions'][i]["userSubscriptionId"]);
           			}
				}
			}else{
				console.log("1deamaxwu ---> subscribe ERROR: "+data['data']['error'])		
			}

            var socketAddress = "ws://" + SessionStorage.get('brokerUrl') +"/websocketlistener";

            console.log('1deamaxwu ---> Creating Web Socket as '+socketAddress);

            $scope.dataStream = $websocket(socketAddress);
            $scope.dataStream.onMessage($scope.parseMessage);
        };

        var userSuccessFunction = function (data) {
            console.log("1deamxwu ---> feed record respond success");
			if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> feeded record success as "+data['data']);
			}else{
				console.log("1deamaxwu ---> feed record ERROR: "+data['data']['error'])
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
            console.log("1deamxwu ---> respond ERROR: " + data['data']);
			$window.alert(data['data']);
        }

        $scope.parseMessage = function (message) {
            console.log('1deamaxwu ---> received websocket message from the server');
            var data = JSON.parse(message.data);

            if ($scope.userId == data['userId']) {
                $scope.latestTimeStamp = data['channelExecutionTime'];


                var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));
                //console.log("Printing:" + subscriptionList);

                function findSubcription(subscriptionId) {
                    return subscriptionId == data['userSubscriptionId'];
                }

                if (undefined != subscriptionList.find(findSubcription)) {
					$scope.ackUserSubscriptionId=data['userSubscriptionId']
					$scope.ackChannelName=data['channelName']
                    HttpGetter.getNewResults($scope.userId, $scope.accessToken, data['userSubscriptionId'],
                        $scope.latestTimeStamp, data['channelName'], SessionStorage.get('brokerUrl'), successFunction, errorFunction);
                }
            }
        }

        $scope.logoutUser = function () {
            $scope.dataStream.close();
			HttpGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
            SessionStorage.remove();
            $window.location.href = '/';
        }

        $scope.switchToSubscriptionsPage = function () {
            $scope.dataStream.close();
            $window.location.href = '/preferences';
        }

        $scope.init = function () {
            $scope.userId = SessionStorage.get('userId');
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.subscriptionId = SessionStorage.get('subscriptionId');
            $scope.latestTimeStamp = SessionStorage.get('timestamp');
			console.log("1deamaxwu ---> current userId: "+$scope.userId)
            HttpGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), 
                subscribeSuccessFunction, errorFunction);
        }
    }]);
