app.controller('NotificationController', ['$scope', '$interval', '$websocket', '$window', '$location', 'NotificationGetter',
    'SessionStorage', 'geolocationService',
    function($scope, $interval, $websocket, $window, $location, NotificationGetter, SessionStorage, geolocationService) {
        SessionStorage.conf();

        $scope.messages = [];
        $scope.mylocation = '';
        //Map Integration
        $scope.map = {
            center: {
                latitude: 33.1451,
                longitude: -117.6680
            },
            zoom: 7
        };
        $scope.options = {
            scrollwheel: false
        };
        $scope.markers = [];
        $scope.shelters =[];
        $scope.circles = [];
        $scope.control = {};
        var bounds = new google.maps.LatLngBounds();


        $scope.renderMap = function() {
            console.log("1deamaxwu ---> rendering map");
            console.log("1deamxwu ---> marker numbers on MAP: " + $scope.circles.length);
            for (var i = 0, length = $scope.circles.length; i < length; i++) {
                var marker = $scope.circles[i].center;
                bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
            }
            $scope.control.getGMap().fitBounds(bounds);

        }
        var acksuccessFunction = function(data) {
            console.log("1deamxwu ---> ackresults respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> acked results success as " + data['data']['status']);
            } else {
                console.log("1deamaxwu ---> ackresults ERROR: " + data['data']['error'])
            }
        }

        var successFunction = function(data) {
            console.log("1deamaxwu ---> all is well with new results");

            NotificationGetter.ackResults($scope.userId, $scope.accessToken, $scope.ackUserSubscriptionId,
                $scope.latestTimeStamp, $scope.ackChannelName, SessionStorage.get('brokerUrl'), acksuccessFunction, errorFunction);

            $scope.messages.reverse();

            if (data['data']['results'] != null) {

                for (i = 0; i < data['data']['results'].length; i++) {
                    iz = data['data']['results'][i]['result']['impactZone']
                    var message = {
                        'emergencytype': data['data']['results'][i]['result']['emergencyType'],
                        'severity': data['data']['results'][i]['result']['severity'],
                        'center': {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        'coordinates': iz[0][0] + "," + iz[0][1],
                        'radius': iz[1],
                        'message': data['data']['results'][i]['result']['message'],
                        'timestamp': data['data']['results'][i]['result']['timestamp'],
                        'msgChannelName': data['data']['channelName']
                    }
                    
                    if (data['data']['results'][i]['result']['shelters']!=null){
                    for (j = 0; j < data['data']['results'][i]['result']['shelters'].length; j++) {
                    var shelter ={
                    	id: Date.now(),
                    	coords: {
                    		latitude: data['data']['results'][i]['result']['shelters'][j]['location'][0],
                    		longitude: data['data']['results'][i]['result']['shelters'][j]['location'][0]
                    	},
                    	options: {
                    		icon: 'res/shelter.png'
                    	},
                    	message: {
                    		'name': data['data']['results'][i]['result']['shelters'][j]['name']
                    	}
                    }
                    console.log("1deamaxwu ---> SHELTER: ");
                    console.log(shelter)
                    $scope.shelters.push(shelter);
                    }
                    }
                    
                    console.log("1deamaxwu ---> RESULTS: ");
					console.log(data['data']['results'])
                    $scope.messages.push(message);
                    var marker = {
                        id: Date.now(),
                        coords: {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        options: {
                            icon: 'res/emergency.png'
                        },
                        message: message
                    };
                    var circle = {
                        id: Date.now(),
                        center: {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        radius: iz[1],
                        stroke: {
                            color: '#C43314',
                            weight: 2,
                            opacity: 1
                        },
                        fill: {
                            color: '#C43314',
                            opacity: 0.5
                        }
                    };
                    $scope.markers.push(marker);
                    $scope.circles.push(circle);
                }
            }
            $scope.messages.reverse();
            $scope.renderMap();
        }
        //get formatted date
        function getFDate() {
            date = new Date();
            year = date.getUTCFullYear();
            month = date.getUTCMonth() + 1;
            day = date.getUTCDate();
            hour = date.getUTCHours();
            minute = date.getUTCMinutes();
            second = date.getUTCSeconds();

            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            if (hour < 10) {
                hour = '0' + hour
            }
            if (minute < 10) {
                minute = '0' + minute
            }
            if (second < 10) {
                second = '0' + second
            }

            return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
        }
        //UUID
        function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
        }

        // function UserPosition(position) {
        function UserPosition() {
            console.log("1deamaxwu ---> interval as UserPosition")

            // var lat = position.coords.latitude;
            // var lng = position.coords.longitude;
            var baselat = 33.64295;
            var baselng = -117.8334311;


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

            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lng
                },
                zoom: 7
            };

            var portNo = 10003;
            Date.now = function() {
                return new Date().getTime();
            }
            $scope.mylocation = {
                id: Date.now(),
                coords: {
                    latitude: lat,
                    longitude: lng
                },
                options: {
                    icon: 'res/emergency.png'
                },
                message: "Your location: "
            };
            /*
            var record = [{
                'recordId': guid(),
                'user-id': SessionStorage.get('userId'),
                'latitude': lat,
                'longitude': lng,
                'timeoffset': 10.0,
                'timestamp': getFDate()
            }];
            */
            off = 10.0
            var record = '{\"recordId\": uuid(\"' + guid() + '\"),\"user-id\":\"' + SessionStorage.get('userId') + '\",\"latitude\":' + lat + ',\"longitude\":' + lng + ',\"timeoffset\":' + off + ',\"timestamp\":datetime(\"' + getFDate() + '\")}';

bounds.extend(new google.maps.LatLng(lat, lng));

            NotificationGetter.feedRecords($scope.userId, $scope.accessToken, portNo, record, SessionStorage.get('brokerUrl'), userSuccessFunction, errorFunction);
        }
        $interval(function() {
            UserPosition();
        }, 10000);


        var subscribeSuccessFunction = function(data) {
            console.log("1deamxwu ---> get subscribtion respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> got subcribtion success as " + data['data']['subscriptions']);

                if (SessionStorage.get("subscriptionId") != null) {
                    SessionStorage.removeElement("subscriptionId");
                }
                if (data['data']['subscriptions'] != null) {
                    for (var i = 0; i < data['data']['subscriptions'].length; i++) {
                        SessionStorage.set('subscriptionId', data['data']['subscriptions'][i]["userSubscriptionId"]);
                    }
                }
            } else {
                console.log("1deamaxwu ---> subscribe ERROR: " + data['data']['error'])
            }

            var socketAddress = "ws://" + SessionStorage.get('brokerUrl') + "/websocketlistener";

            console.log('1deamaxwu ---> Creating Web Socket as ' + socketAddress);

            $scope.dataStream = $websocket(socketAddress);
            $scope.dataStream.onMessage($scope.parseMessage);
        };

        var userSuccessFunction = function(data) {
            console.log("1deamxwu ---> feed record respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> feeded record success as " + data['data']);
            } else {
                console.log("1deamaxwu ---> feed record ERROR: " + data['data']['error'])
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

        var errorFunction = function(data) {
            console.log("1deamxwu ---> respond ERROR: " + data['data']);
            $window.alert(data['data']);
        }

        $scope.parseMessage = function(message) {
            console.log('1deamaxwu ---> received websocket message from the server');
            var data = JSON.parse(message.data);

            if ($scope.userId == data['userId']) {
                $scope.latestTimeStamp = data['channelExecutionTime'];
                var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));

                function findSubcription(subscriptionId) {
                    return subscriptionId == data['userSubscriptionId'];
                }

                //return the item find in subscriptionList
                if (undefined != subscriptionList.find(findSubcription)) {
                    $scope.ackUserSubscriptionId = data['userSubscriptionId']
                    $scope.ackChannelName = data['channelName']
                    console.log("1deamxwu ---> DATA post newresults.");
                    NotificationGetter.getNewResults($scope.userId, $scope.accessToken, data['userSubscriptionId'],
                        $scope.latestTimeStamp, data['channelName'], SessionStorage.get('brokerUrl'), successFunction, errorFunction);
                }
            }
        }

        $scope.logoutUser = function() {
            $scope.dataStream.close();
            NotificationGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
            
        }

        $scope.init = function() {
            $scope.userId = SessionStorage.get('userId');
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.subscriptionId = SessionStorage.get('subscriptionId');
            $scope.latestTimeStamp = SessionStorage.get('timestamp');
            console.log("1deamaxwu ---> current userId: " + $scope.userId)
            UserPosition();
            NotificationGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'),
                subscribeSuccessFunction, errorFunction);
        }
    }
]);
