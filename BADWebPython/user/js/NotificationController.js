app.controller('NotificationController', ['$scope', '$interval', '$websocket', '$window', '$location', 'NotificationGetter',
    'SessionStorage', 'geolocationService',
    function($scope, $interval, $websocket, $window, $location, NotificationGetter, SessionStorage, geolocationService) {
        SessionStorage.conf();
        $scope.alertmsg = "";
        $scope.alertjump = "";
        $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
        $scope.mylocation = '';
        $scope.orderByField = 'timestamp';
        $scope.reverseSort = true;
        $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory'));
        console.log("1deamaxwu ---> LLLLLLLLLLLLLLLLLLLsss");
                    console.log($scope.notiHistory);
        $scope.numNoti = SessionStorage.get('numNoti') == null ? 0 : SessionStorage.get('numNoti');
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
        $scope.markers = JSON.parse(SessionStorage.get('markers')) == null ? [] : JSON.parse(SessionStorage.get('markers'));
        $scope.shelters = JSON.parse(SessionStorage.get('shelters')) == null ? [] : JSON.parse(SessionStorage.get('shelters'));
        $scope.circles = JSON.parse(SessionStorage.get('circles')) == null ? [] : JSON.parse(SessionStorage.get('circles'));
        $scope.control = {};
        var bounds = new google.maps.LatLngBounds();
    
        $scope.closeAlert = function() {
            if ($scope.alertjump != "") {
                $window.location.href = $scope.alertjump;
            }
        }
		function hasValue(arr, key, val) {
			if (arr == null){
				return false;
			}
			for (var i = 0; i < arr.length; i++){
				if(arr[i][key] == val){
					return true;
				}
			}
			return false;
		}
		
		function interSect(item, rad, loc){
			//console.log(item);
			//console.log(loc);
			if ((item.latitude-loc.latitude) * (item.latitude-loc.latitude) + (item.longitude-loc.longitude) * (item.longitude-loc.longitude) <= rad * rad){
				return true;
			}
			return false;
		}
		
		function setVisibl(id, val){
			for (var i = 0; i < $scope.markers.length; i++){
				if ($scope.markers[i].id == id){
					$scope.markers[i].options.visible = val;
				}
				if ($scope.circles[i].id == id){
					$scope.circles[i].visible = val;
				}
				
				//console.log($scope.circles[i].options.visible);
			}
			for (var i = 0; i < $scope.shelters.length; i++){
				if ($scope.shelters[i].sid == id){
					$scope.shelters[i].options.visible = val;
				}
			}
		}
		
		function updateInterSect(loc){
			console.log("1deamxwu ---> TOTAL: " + $scope.messages.length);
			for (var i = 0; i < $scope.messages.length; i++){
			if ($scope.messages[i].msgChannelName.includes("IntUser")){
				if (interSect($scope.messages[i].center, $scope.messages[i].radius/100000, loc)){
					console.log("1deamxwu ---> marker SHOWED!");
					$scope.messages[i].visibl = true;	
					setVisibl($scope.messages[i].reportId, true);
				}else {
					console.log("1deamxwu ---> marker REMOVED!");
					$scope.messages[i].visibl = false;	
					setVisibl($scope.messages[i].reportId, false);
				}
			}
			}	
		}
		
		$scope.AfterRead = function(){
				SessionStorage.removeElement("numNoti");
                SessionStorage.removeElement("messages");
                SessionStorage.removeElement("markers");
                SessionStorage.removeElement("shelters");
                SessionStorage.removeElement("circles");
		}
		/*
		var SortBy = function(field, rever, primer){
			console.log("1deamxwu ---> SORT by: " + field);
			var key = primer ? 
       			function(x) {return primer(x[field])} : 
       			function(x) {return x[field]};

   			rever = !rever ? 1 : -1;

   			return function (a, b) {
       			return a = key(a), b = key(b), rever * ((a > b) - (b > a));
     		} 
		}
		*/
		// Sort by price high to low
		//homes.sort(sort_by('price', true, parseInt));
	
		// Sort by city, case-insensitive, A-Z
		//homes.sort(sort_by('city', false, function(a){return a.toUpperCase()}));

        $scope.renderMap = function() {
            console.log("1deamaxwu ---> rendering map");
            console.log("1deamxwu ---> marker numbers on MAP: " + $scope.circles.length);
            for (var i = 0, length = $scope.circles.length; i < length; i++) {
                var marker = $scope.circles[i].center;
                bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
            }
            bounds.extend(new google.maps.LatLng($scope.mylocation.coords.latitude, $scope.mylocation.coords.longitude));
            $scope.control.getGMap().fitBounds(bounds);

        }
        var acksuccessFunction = function(data) {
            console.log("1deamxwu ---> ackresults respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> acked results success as " + data['data']['status']);
            } else {
                console.log("1deamaxwu ---> ackresults ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    //$window.alert("Invalid access token! Your account has been accessed at another device!");
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    //$window.alert("User is not authenticated! Please re-login!");
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    //$window.alert(data['data']['error']);
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }
		
		var historySuccessFunction = function(data) {
            console.log("1deamaxwu ---> all is well with HISTORY results");
            if (data['data']['results'] != null) {
            	console.log(data['data']);
            	for (i = 0; i < data['data']['results'].length; i++) {
            		if (hasValue($scope.notiHistory, 'reportId', data['data']['results'][i]['result']['reports']['reportId'])){
                		console.log("1deamaxwu ---> DUPLICATE!");
                		continue;
                	}
            		
            		iz = data['data']['results'][i]['result']['reports']['impactZone']
                    var message = {
                    	'reportId': data['data']['results'][i]['result']['reports']['reportId'],
                        'emergencytype': data['data']['results'][i]['result']['reports']['emergencyType'],
                        'severity': data['data']['results'][i]['result']['reports']['severity'],
                        'center': {
                            latitude: iz[0][0].toFixed(6),
                            longitude: iz[0][1].toFixed(6)
                        },
                        'coordinates': iz[0][0].toFixed(6) + "," + iz[0][1].toFixed(6),
                        'radius': Math.round(iz[1].toFixed(4)*100000),
                        'message': data['data']['results'][i]['result']['reports']['message'],
                        'duration': data['data']['results'][i]['result']['reports']['duration'].toFixed(6),
                        'timestamp': data['data']['results'][i]['result']['reports']['timestamp'],
                        'msgChannelName': data['data']['channelName'],
                        'visibl': true
                    }
                    
            		SessionStorage.set('notiHistory', message);
                    $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory'));
                    console.log("1deamaxwu ---> LLLLLLLLLLLLLLLLLLL");
                    console.log($scope.notiHistory);
            	}
            }
		}
        var successFunction = function(data) {
            console.log("1deamaxwu ---> all is well with new results");

            NotificationGetter.ackResults($scope.userId, $scope.accessToken, $scope.ackUserSubscriptionId,
                $scope.latestTimeStamp, $scope.ackChannelName, SessionStorage.get('brokerUrl'), acksuccessFunction, errorFunction);

            if (data['data']['results'] != null) {
            	console.log(data['data']);
                for (i = 0; i < data['data']['results'].length; i++) {
                	//local client side duplicate verification
                	if (hasValue($scope.messages, 'reportId', data['data']['results'][i]['result']['reports']['reportId'])){
                		console.log("1deamaxwu ---> DUPLICATE!");
                		continue;
                	}
                    iz = data['data']['results'][i]['result']['reports']['impactZone']
                    var message = {
                    	'reportId': data['data']['results'][i]['result']['reports']['reportId'],
                        'emergencytype': data['data']['results'][i]['result']['reports']['emergencyType'],
                        'severity': data['data']['results'][i]['result']['reports']['severity'],
                        'center': {
                            latitude: iz[0][0].toFixed(6),
                            longitude: iz[0][1].toFixed(6)
                        },
                        'coordinates': iz[0][0].toFixed(6) + "," + iz[0][1].toFixed(6),
                        'radius': Math.round(iz[1].toFixed(4)*100000),
                        'message': data['data']['results'][i]['result']['reports']['message'],
                        'duration': data['data']['results'][i]['result']['reports']['duration'].toFixed(6),
                        'timestamp': data['data']['results'][i]['result']['reports']['timestamp'],
                        'msgChannelName': data['data']['channelName'],
                        'visibl': true
                    }
					//console.log(data['data']['results'][i]['result']['reports']['timestamp']);
                    if (data['data']['results'][i]['result']['shelters'] != null) {
                    	if (data['data']['results'][i]['result']['shelters'].length == undefined) {
                    		//if (hasValue($scope.shelters, 'sname', data['data']['results'][i]['result']['shelters'][j]['name'])){
                    		//	console.log("1deamaxwu ---> Shelter DUPLICATE!");
                    		//} else {
                    		var shelter = {
                                id: Date.now(),
                                sid: data['data']['results'][i]['result']['reports']['reportId'],
                                sname: data['data']['results'][i]['result']['shelters'][j]['name'],
                                coords: {
                                    latitude: data['data']['results'][i]['result']['shelters']['location'][0],
                                    longitude: data['data']['results'][i]['result']['shelters']['location'][1]
                                },
                                options: {
                                    icon: 'res/shelter.png',
                                    visible: true
                                },
                                message: {
                                    'name': data['data']['results'][i]['result']['shelters']['name'],
                                    'coords': {
                                        latitude: data['data']['results'][i]['result']['shelters']['location'][0].toFixed(6),
                                        longitude: data['data']['results'][i]['result']['shelters']['location'][1].toFixed(6)
                                    },
                                }
                            }
                            console.log("1deamaxwu ---> SHELTER at Location: ");
                            //console.log(shelter)
                            //$scope.shelters.push(shelter);
                            SessionStorage.set('shelters', shelter);
                    $scope.shelters = JSON.parse(SessionStorage.get('shelters'));
                            //}
                    	} else {
                        	for (j = 0; j < data['data']['results'][i]['result']['shelters'].length; j++) {
                        		//if (hasValue($scope.shelters, 'sname', data['data']['results'][i]['result']['shelters'][j]['name'])){
                    			//	console.log("1deamaxwu ---> Shelter DUPLICATE!");
                    			//} else {
                           	 	var shelter = {
                                	id: Date.now(),
                                	sid: data['data']['results'][i]['result']['reports']['reportId'],
                                	sname: data['data']['results'][i]['result']['shelters'][j]['name'],
                                	coords: {
                                    	latitude: data['data']['results'][i]['result']['shelters'][j]['location'][0],
                                    	longitude: data['data']['results'][i]['result']['shelters'][j]['location'][1]
                                	},
                                	options: {
                                    	icon: 'res/shelter.png',
                                    	visible: true
                                	},
                                	message: {
                                    	'name': data['data']['results'][i]['result']['shelters'][j]['name'],
                                    	'coords': {
                                        	latitude: data['data']['results'][i]['result']['shelters'][j]['location'][0].toFixed(6),
                                        	longitude: data['data']['results'][i]['result']['shelters'][j]['location'][1].toFixed(6)
                                    	},
                                	}
                            	}
                            	console.log("1deamaxwu ---> SHELTER from NearMe: ");
                            	//console.log(shelter)
                            	//$scope.shelters.push(shelter);
                            	SessionStorage.set('shelters', shelter);
                    $scope.shelters = JSON.parse(SessionStorage.get('shelters'));
                            	//}
                        	}
                        }
                    }

                    console.log("1deamaxwu ---> RESULTS: ");
                    //console.log(data['data']['results'][i]['result']);
                    //$scope.messages.reverse();
                    //$scope.messages.push(message);
                    //$scope.messages.reverse();
                    var marker = {
                        id: data['data']['results'][i]['result']['reports']['reportId'],
                        coords: {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        options: {
                            icon: 'res/emergency.png',
                            visible: true
                        },
                        message: message,
                    };
                    var circle = {
                        id: data['data']['results'][i]['result']['reports']['reportId'],
                        center: {
                            latitude: iz[0][0],
                            longitude: iz[0][1]
                        },
                        radius: iz[1].toFixed(4) * 100000,
                        stroke: {
                            color: '#C43314',
                            weight: 2,
                            opacity: 1
                        },
                        fill: {
                            color: '#C43314',
                            opacity: 0.5
                        },
                        visible: true
                    };
                    //$scope.markers.push(marker);
                    //$scope.circles.push(circle);
                    
                    SessionStorage.set('notiHistory', message);
                    $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory'));
                    //console.log("1deamaxwu ---> LLLLLLLLLLLLLLLLLLL");
                    //console.log($scope.notiHistory);
                    SessionStorage.set('messages', message);
                    SessionStorage.set('markers', marker);
                    SessionStorage.set('circles', circle);
                    $scope.messages = JSON.parse(SessionStorage.get('messages'));
                    $scope.markers = JSON.parse(SessionStorage.get('markers'));
                    $scope.circles = JSON.parse(SessionStorage.get('circles'));
                    //$scope.notiHistory.sort(SortBy('timestamp', true, function(a){return a.toUpperCase()}));
                    //$scope.messages.sort(SortBy('timestamp', true, function(a){return a.toUpperCase()}));
                    //$scope.notiHistory.sort(SortBy('emergencytype', false, function(a){return a.toUpperCase()}));
                    //$scope.notiHistory.sort(SortBy('severity', false, parseInt));
                    
                    $scope.numNoti = $scope.markers.length;
                    SessionStorage.set('numNoti', $scope.numNoti);
                    
                    updateInterSect($scope.mylocation.coords);
                }
            }
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
		//
		$scope.MyLoc = function(){
			
            $scope.map = {
                center: {
                    latitude: $scope.mylocation.coords.latitude,
                    longitude: $scope.mylocation.coords.longitude
                },
                zoom: 7
            };
            
		}
		function MyLoc(){
			
            $scope.map = {
                center: {
                    latitude: $scope.mylocation.coords.latitude,
                    longitude: $scope.mylocation.coords.longitude
                },
                zoom: 7
            };
            
		}
		function initBaseLoc(){
		$scope.baselat = 33.64295;
            $scope.baselng = -117.8334311;


            var uname = SessionStorage.get('userName')
            console.log("1deamaxwu ---> NAME: " + uname );
            if (uname == "Rose") {
                $scope.baselat = 33.9459957;
                $scope.baselng = -117.4695675;
            } else if (uname == "Adam") {
                $scope.baselat = 30.3076863;
                $scope.baselng = -97.8934839;
            } else if (uname == "Walt") {
                $scope.baselat = 38.8993277;
                $scope.baselng = -77.0846059;
            } else if (uname == "Will") {
                $scope.baselat = 38.8993277;
                $scope.baselng = -77.0846059;
            } else if (uname == "Mary") {
            $scope.baselat = 48.1548895;
            $scope.baselng = 11.4717964;
        } else {
                console.log("1deamaxwu ---> undefault location.")
            }
            console.log("1deamaxwu ---> location: (" + $scope.baselat + ',' + $scope.baselng + ')')

		}
        // function UserPosition(position) {
        function UserPosition() {
            console.log("1deamaxwu ---> interval as UserPosition")

            // var lat = position.coords.latitude;
            // var lng = position.coords.longitude;
            
            var lat = $scope.baselat + Math.random();
            var lng = $scope.baselng + Math.random();

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
                    draggable: true
                },
                message: "Your location: ",
                events: {
            dragend: function(marker, eventName, args) {
                var lti = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                console.log("1deamaxwu ---> marker dragend: " + lti + ',' + lon);

                $scope.mylocation.options = {
                    draggable: true,
                    labelContent: "(" + $scope.mylocation.coords.latitude.toFixed(6) + ', ' + $scope.mylocation.coords.longitude.toFixed(6)+')',
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
                $scope.baselat = lti;
                $scope.baselng = lon;
                updateInterSect($scope.mylocation.coords);
                
            }
        }
            };
            updateInterSect($scope.mylocation.coords);
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

            //bounds.extend(new google.maps.LatLng(lat, lng));

            NotificationGetter.feedRecords($scope.userId, $scope.accessToken, portNo, record, SessionStorage.get('brokerUrl'), userSuccessFunction, errorFunction);


            //testrecord="{\"emergencyType\":\"tornado\",\"message\":\"tornado alert!\",\"timeoffset\":104.77809239986131,\"duration\":504.3711956896303,\"severity\":2,\"impactZone\":circle(\"42.49638466552997,-92.97254723406066 100000\"),\"timestamp\":datetime(\"2017-02-11T00:54:01Z\"),\"reportId\":uuid(\"572d1f02-dd16-4e69-999e-343ee72c16c0\")}";

            //console.log("TESTTTTTTTTTTTTT: "+testrecord)

            //NotificationGetter.feedRecords($scope.userId, $scope.accessToken, 10001, testrecord, SessionStorage.get('brokerUrl'), userSuccessFunction, errorFunction);
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
                GetHistory();
            } else {
                console.log("1deamaxwu ---> subscribe ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    //$window.alert("Invalid access token! Your account has been accessed at another device!");
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    //$window.alert("User is not authenticated! Please re-login!");
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    //$window.alert(data['data']['error']);
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }

            var socketAddress = "ws://" + SessionStorage.get('brokerUrl') + "/websocketlistener";

            console.log('1deamaxwu ---> Creating Web Socket as ' + socketAddress);

            $scope.dataStream = $websocket(socketAddress);
            console.log($scope.dataStream);
            $scope.dataStream.onMessage($scope.parseMessage);
            $scope.dataStream.onOpen($scope.parseOpen);
            $scope.dataStream.onClose($scope.parseClose);
        };

        var userSuccessFunction = function(data) {
            console.log("1deamxwu ---> feed record respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> feeded record success as " + data['data']);
            } else {
                console.log("1deamaxwu ---> feed record ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    //$window.alert("Invalid access token! Your account has been accessed at another device!");
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    //$window.alert("User is not authenticated! Please re-login!");
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    //$window.alert(data['data']['error']);
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }
        var logoutSuccessFunction = function(data) {
            console.log("1deamxwu ---> logout respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
                $scope.dataStream.close();
                //SessionStorage.remove();
                SessionStorage.removeElement("accessToken");
                SessionStorage.removeElement("userId");
                SessionStorage.removeElement("userName");
                SessionStorage.removeElement("notiHistory");
                SessionStorage.removeElement("numNoti");
                SessionStorage.removeElement("messages");
                SessionStorage.removeElement("markers");
                SessionStorage.removeElement("shelters");
                SessionStorage.removeElement("circles");
                $window.location.href = 'index.html';
            } else {
                console.log("1deamaxwu ---> logged out ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    //$window.alert("Invalid access token! Your account has been accessed at another device!");
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    //$window.alert("User is not authenticated! Please re-login!");
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    //$window.alert(data['data']['error']);
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }

        var errorFunction = function(data) {
            console.log("1deamxwu ---> respond ERROR: " + data['data']);
            //$window.alert(data['data']);
            $scope.alertmsg = "Error Connection! " + data['data'];
            $("#alertmodal").modal('show');
            $scope.alertjump = "";
        }
		
		$scope.parseOpen = function() {
			console.log('1deamaxwu ---> websocket OPEN');
		}
		
		$scope.parseClose = function() {
			console.log('1deamaxwu ---> websocket CLOSE');
		}
        $scope.parseMessage = function(message) {
            console.log('1deamaxwu ---> received websocket message from the server');
            var data = JSON.parse(message.data);

            if ($scope.userId == data['userId']) {
                $scope.latestTimeStamp = data['channelExecutionTime'];
                //$scope.latestTimeStamp = "2017-02-24T20:53:58.410Z";
                var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));

                function findSubcription(subscriptionId) {
                    return subscriptionId == data['userSubscriptionId'];
                }

                //return the item find in subscriptionList
                if (undefined != subscriptionList.find(findSubcription)) {
                    $scope.ackUserSubscriptionId = data['userSubscriptionId']
                    $scope.ackChannelName = data['channelName']
                    console.log("1deamxwu ---> DATA post newresults: " + $scope.userId + "; " + $scope.accessToken + "; " + data['userSubscriptionId'] + "; " + $scope.latestTimeStamp + "; " + data['channelName']);
                    NotificationGetter.getNewResults($scope.userId, $scope.accessToken, data['userSubscriptionId'],
                        $scope.latestTimeStamp, data['channelName'], SessionStorage.get('brokerUrl'), successFunction, errorFunction);
                }
            }
        }

		function GetHistory(){
			var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));
			if (subscriptionList != null){
			for (var i = 0; i < subscriptionList.length; i++){
				item = subscriptionList[i].split("::");
				channelName = item[2];
				console.log("1deamxwu ---> SUB_name: " + channelName);
				NotificationGetter.getHistory($scope.userId, $scope.accessToken, subscriptionList[i],
                        getFDate(), channelName, SessionStorage.get('brokerUrl'), historySuccessFunction, errorFunction);
			}
			}
		}		
		
        $scope.logoutUser = function() {

            NotificationGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);

        }

        $scope.init = function() {
            $scope.userId = SessionStorage.get('userId');
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.subscriptionId = SessionStorage.get('subscriptionId');
            $scope.latestTimeStamp = SessionStorage.get('timestamp');
            console.log("1deamaxwu ---> current userId: " + $scope.userId);
            initBaseLoc();
            UserPosition();
            MyLoc();
            
            NotificationGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'),
                subscribeSuccessFunction, errorFunction);
        }
    }
]);
