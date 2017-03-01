app.controller('ProfileController', ['$scope', '$window', '$filter', '$websocket', 'ProfileGetter', 'SubscriptionGetter', 'SessionStorage',
    function($scope, $window, $filter, $websocket, ProfileGetter, SubscriptionGetter, SessionStorage) {

        var updateSuccessFunction = function(data) {

        }

        $scope.closeAlert = function() {
            if ($scope.alertjump != "") {
                $window.location.href = $scope.alertjump;
            }
        }

        var logoutSuccessFunction = function(data) {
            console.log("1deamxwu ---> logout respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
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
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }
        var errorFunction = function(data) {
            console.log("1deamxwu ---> respond ERROR: " + data['data']);
            $scope.alertmsg = "Error Connection! " + data['data'];
            $("#alertmodal").modal('show');
            $scope.alertjump = "";
        }

        $scope.updateUserInfo = function(name, email, bio) {
        	$scope.alertmsg = "NOT ready function!";
			$("#alertmodal").modal('show');
            $scope.alertjump = "";
            //ProfileGetter.updateUserInfo($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), name, email, bio, updateSuccessFunction, errorFunction);
            console.log("1deamaxwu ---> update user info as: " + name + " " + email + " " + bio)
        };

        $scope.logoutUser = function() {
            ProfileGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);

        };

        function hasValue(arr, key, val) {
            if (arr == null) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == val) {
                    return true;
                }
            }
            return false;
        }
        var acksuccessFunction = function(data) {
            console.log("1deamxwu ---> ackresults respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> acked results success as " + data['data']['status']);
            } else {
                console.log("1deamaxwu ---> ackresults ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'index.html';
                } else {
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }
        var parseSuccessFunction = function(data) {
            console.log("1deamaxwu ---> all is well with new results");

            SubscriptionGetter.ackResults($scope.userId, $scope.accessToken, $scope.ackUserSubscriptionId,
                $scope.latestTimeStamp, $scope.ackChannelName, SessionStorage.get('brokerUrl'), acksuccessFunction, errorFunction);

            if (data['data']['results'] != null) {
                console.log(data['data']);
                for (i = 0; i < data['data']['results'].length; i++) {
                    //local client side duplicate verification
                    if (hasValue($scope.messages, 'reportId', data['data']['results'][i]['result']['reports']['reportId'])) {
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
                        'radius': Math.round(iz[1].toFixed(4) * 100000),
                        'message': data['data']['results'][i]['result']['reports']['message'],
                        'duration': data['data']['results'][i]['result']['reports']['duration'].toFixed(6),
                        'timestamp': data['data']['results'][i]['result']['reports']['timestamp'],
                        'msgChannelName': data['data']['channelName'],
                        'visibl': true
                    }
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
                                SessionStorage.set('shelters', shelter);
                                $scope.shelters = JSON.parse(SessionStorage.get('shelters'));
                                //}
                            }
                        }
                    }

                    console.log("1deamaxwu ---> RESULTS: ");
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

                    SessionStorage.set('notiHistory', message); 
                    SessionStorage.set('messages', message);
                    SessionStorage.set('markers', marker);
                    SessionStorage.set('circles', circle);
                    
                    $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory'));
                    $scope.messages = JSON.parse(SessionStorage.get('messages'));
                    $scope.markers = JSON.parse(SessionStorage.get('markers'));
                    $scope.circles = JSON.parse(SessionStorage.get('circles'));
                  
                    $scope.numNoti = $scope.markers.length;
                    SessionStorage.set('numNoti', $scope.numNoti);
                }
            }
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
                    SubscriptionGetter.getNewResults($scope.userId, $scope.accessToken, data['userSubscriptionId'],
                        $scope.latestTimeStamp, data['channelName'], SessionStorage.get('brokerUrl'), parseSuccessFunction, errorFunction);
                }
            }
        }
        
        $scope.init = function() {
            SessionStorage.conf();

            $scope.alertmsg = "";
            $scope.alertjump = "";
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.userId = SessionStorage.get('userId');

            $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
            $scope.markers = JSON.parse(SessionStorage.get('markers')) == null ? [] : JSON.parse(SessionStorage.get('markers'));
            $scope.shelters = JSON.parse(SessionStorage.get('shelters')) == null ? [] : JSON.parse(SessionStorage.get('shelters'));;
            $scope.circles = JSON.parse(SessionStorage.get('circles')) == null ? [] : JSON.parse(SessionStorage.get('circles'));;
            $scope.numNoti = SessionStorage.get('numNoti') == null ? 0 : SessionStorage.get('numNoti');

            $scope.uname = SessionStorage.get('userName')
            $scope.uemail = $scope.uname + "@bad.com"
            $scope.ucity = "Unknown"
            if ($scope.uname == "Rose") {
                $scope.ucity = "Riverside, CA"
            } else if ($scope.uname == "Adam") {
                $scope.ucity = "Austin, TX"
            } else if ($scope.uname == "Walt") {
                $scope.ucity = "Washington D.C."
            } else if ($scope.uname == "Will") {
                $scope.ucity = "Washington D.C."
            } else if ($scope.uname == "Mary") {
            	$scope.ucity = "Munich, German"
        	} else {
                console.log("1deamaxwu ---> city: " + $scope.uname)
            }
            console.log("1deamaxwu ---> profile: " + $scope.uname)
            var socketAddress = "ws://" + SessionStorage.get('brokerUrl') + "/websocketlistener";

            console.log('1deamaxwu ---> Creating Web Socket as ' + socketAddress);

            $scope.dataStream = $websocket(socketAddress);
            $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
            console.log($scope.dataStream);
            $scope.dataStream.onMessage($scope.parseMessage);
        }

    }
]);
