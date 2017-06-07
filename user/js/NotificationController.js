app.controller('NotificationController', ['$scope', '$interval', '$websocket', '$window', '$location', 'NotificationGetter', 'EmergenciesGetter',
    'SessionStorage', 'geolocationService',
    function($scope, $interval, $websocket, $window, $location, NotificationGetter, EmergenciesGetter, SessionStorage, geolocationService) {

        var bounds = new google.maps.LatLngBounds();

        $scope.closeAlert = function() {
            if ($scope.alertjump != "") {
                $window.location.href = $scope.alertjump;
            }
        }

        function DataShowRender() {
            $scope.showmsg = {
                'incoming': $scope.messages,
                'inactive': $scope.notiHistory,
                'history': $scope.notiHistory
            };

            historymkrs = [];
            historyclcs = [];
            for (i = 0; i < $scope.notiHistory.length; i++) {
                msg = $scope.notiHistory[i];
                mkr = {
                    id: msg['reportId'],
                    coords: {
                        latitude: msg['center']['latitude'],
                        longitude: msg['center']['longitude']
                    },
                    options: {
                        icon: 'res/emergency.png',
                        visible: true
                    },
                    message: msg,
                    timestamp: msg['timestamp'],
                    duration: msg['duration']

                };
                clc = {
                    id: msg['reportId'],
                    center: {
                        latitude: msg['center']['latitude'],
                        longitude: msg['center']['longitude']
                    },
                    radius: msg['radius'],
                    stroke: {
                        color: '#C43314',
                        weight: 2,
                        opacity: 1
                    },
                    fill: {
                        color: '#C43314',
                        opacity: 0.5
                    },
                    visible: true,
                    timestamp: msg['timestamp'],
                    duration: msg['duration']
                };
                historymkrs.push(mkr);
                historyclcs.push(clc);
            };

            $scope.historymkrs = historymkrs;
            $scope.historyclcs = historyclcs;

            $scope.showmkr = {
                'incoming': $scope.markers,
                'inactive': $scope.historymkrs,
                'history': $scope.historymkrs
            };

            $scope.showclc = {
                'incoming': $scope.circles,
                'inactive': $scope.historyclcs,
                'history': $scope.historyclcs
            };
        }

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

        function interSect(item, rad, loc) {
            if ((item.latitude - loc.latitude) * (item.latitude - loc.latitude) + (item.longitude - loc.longitude) * (item.longitude - loc.longitude) <= rad * rad) {
                return true;
            }
            return false;
        }

        function setVisibl(id, val) {
            for (var i = 0; i < $scope.markers.length; i++) {
                if ($scope.markers[i].id == id) {
                    $scope.markers[i].options.visible = val;
                }
                if ($scope.circles[i].id == id) {
                    $scope.circles[i].visible = val;
                }
            }
            for (var i = 0; i < $scope.shelters.length; i++) {
                if ($scope.shelters[i].sid == id) {
                    $scope.shelters[i].options.visible = val;
                }
            }
        }

        function updateInterSect(loc) {
            console.log("1deamxwu ---> TOTAL: " + $scope.messages.length);
            for (var i = 0; i < $scope.messages.length; i++) {
                if ($scope.messages[i].msgChannelName.includes("IntUser")) {
                    if (interSect($scope.messages[i].center, $scope.messages[i].radius / 100000, loc)) {
                        console.log("1deamxwu ---> marker SHOWED!");
                        $scope.messages[i].visibl = true;
                        setVisibl($scope.messages[i].reportId, true);
                    } else {
                        console.log("1deamxwu ---> marker REMOVED!");
                        $scope.messages[i].visibl = false;
                        setVisibl($scope.messages[i].reportId, false);
                    }
                }
            }
            DataShowRender();
        }
        $scope.myFilter = function() {
            return function(item) {
                if ($scope.showtype == "inactive") {
                    //console.log((Date.now() - Date.parse(item['timestamp']))/1000);
                    return Date.now() - Date.parse(item['timestamp']) < item['duration'] * 1000;
                } else {
                    return true
                }

            }
        }

        $scope.AfterRead = function() {
            SessionStorage.removeElement("numNoti");
            SessionStorage.removeElement("messages");
            SessionStorage.removeElement("markers");
            SessionStorage.removeElement("shelters");
            SessionStorage.removeElement("circles");
        }

        $scope.typeChange = function() {
            if ($scope.showtype == "incoming") {
                console.log("1deamaxwu ---> SHOW incoming.");
            } else if ($scope.showtype == "inactive") {
                console.log("1deamaxwu ---> SHOW inactive.");

            } else if ($scope.showtype == "history") {
                console.log("1deamaxwu ---> SHOW hitsoty.");
            } else {
                console.log("1deamaxwu ---> unrecognized SHOW option.");

            }
        }

        $scope.renderMap = function() {
            console.log("1deamaxwu ---> rendering map");
            console.log("1deamxwu ---> marker numbers on MAP: " + $scope.circles.length);
            if ($scope.circles.length == 0) {
                return;
            }
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
		
		var batrptSuccessFunction = function(data) {
            console.log("1deamxwu ---> battle report respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> battle report results success as " + data['data']['status']);
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
        
        var historySuccessFunction = function(data) {
            console.log("1deamaxwu ---> all is well with HISTORY results");
            if (data['data']['results'] != null) {
                for (i = 0; i < data['data']['results'].length; i++) {
                    if (hasValue($scope.notiHistory, 'reportId', data['data']['results'][i]['result']['reports']['reportId'])) {
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
                    SessionStorage.set('notiHistory', message);
                    $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory'));

                }
                DataShowRender();
            }
        }
        var successFunction = function(data) {
            console.log("1deamaxwu ---> all is well with new results");

            NotificationGetter.ackResults($scope.userId, $scope.accessToken, $scope.ackUserSubscriptionId,
                $scope.latestTimeStamp, $scope.ackChannelName, SessionStorage.get('brokerUrl'), acksuccessFunction, errorFunction);

            if (data['data']['results'] != null) {
                for (i = 0; i < data['data']['results'].length; i++) {
                    //local client side duplicate verification
                    if (hasValue($scope.messages, 'reportId', data['data']['results'][i]['result']['reports']['reportId'])) {
                        console.log("1deamaxwu ---> DUPLICATE!");
                        continue;
                    }
                    iz = data['data']['results'][i]['result']['reports']['impactZone']
                    var message = {
                        'reportId': data['data']['results'][i]['result']['reports']['reportId'],
                        'userId': data['data']['results'][i]['result']['reports']['userId'],
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
                            //if (hasValue($scope.shelters, 'sname', data['data']['results'][i]['result']['shelters'][j]['shelter']['name'])){
                            //	console.log("1deamaxwu ---> Shelter DUPLICATE!");
                            //} else {
                            var shelter = {
                                id: Date.now(),
                                sid: data['data']['results'][i]['result']['reports']['reportId'],
                                sname: data['data']['results'][i]['result']['shelters']['name'],
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
                                //if (hasValue($scope.shelters, 'sname', data['data']['results'][i]['result']['shelters'][j]['shelter']['name'])){
                                //	console.log("1deamaxwu ---> Shelter DUPLICATE!");
                                //} else {
                                var shelter = {
                                    id: Date.now(),
                                    sid: data['data']['results'][i]['result']['reports']['reportId'],
                                    sname: data['data']['results'][i]['result']['shelters'][j]['shelter']['name'],
                                    coords: {
                                        latitude: data['data']['results'][i]['result']['shelters'][j]['shelter']['location'][0],
                                        longitude: data['data']['results'][i]['result']['shelters'][j]['shelter']['location'][1]
                                    },
                                    options: {
                                        icon: 'res/shelter.png',
                                        visible: true
                                    },
                                    message: {
                                        'name': data['data']['results'][i]['result']['shelters'][j]['shelter']['name'],
                                        'coords': {
                                            latitude: data['data']['results'][i]['result']['shelters'][j]['shelter']['location'][0].toFixed(6),
                                            longitude: data['data']['results'][i]['result']['shelters'][j]['shelter']['location'][1].toFixed(6)
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
                            color: $scope.colors[message['emergencytype']],
                            weight: 2,
                            opacity: 1
                        },
                        fill: {
                            color: $scope.colors[message['emergencytype']],
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

                    DataShowRender();

                    $scope.numNoti = $scope.markers.length;
                    SessionStorage.set('numNoti', $scope.numNoti);
					
					// report battle if got hit
					batmsg = message['userId'] + ' HIT: ' + $scope.userId + ' got HIT by ' + message['emergencytype'] + ' in ' + message['coordinates'] + ' at ' + message['timestamp'];
					NotificationGetter.battleReport($scope.userId, $scope.accessToken, batmsg, SessionStorage.get('brokerUrl'), batrptSuccessFunction, errorFunction);
                
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
        $scope.MyLoc = function() {

            $scope.map.center.latitude = $scope.mylocation.coords.latitude;
            $scope.map.center.longitude = $scope.mylocation.coords.longitude;
        }

        function MyLoc() {

            $scope.map.center.latitude = $scope.mylocation.coords.latitude;
            $scope.map.center.longitude = $scope.mylocation.coords.longitude;
        }

        function initBaseLoc() {
            $scope.baselat = $scope.cities[0].loc.lat;
            $scope.baselng = $scope.cities[0].loc.lng;

            var uname = SessionStorage.get('userName')
            console.log("1deamaxwu ---> NAME: " + uname)
            if (uname == "Rose") {
                $scope.baselat = $scope.cities[4].loc.lat;
                $scope.baselng = $scope.cities[4].loc.lng;
            } else if (uname == "Adam") {
                $scope.baselat = $scope.cities[5].loc.lat;
                $scope.baselng = $scope.cities[5].loc.lng;
            } else if (uname == "Walt") {
                $scope.baselat = $scope.cities[3].loc.lat;
                $scope.baselng = $scope.cities[3].loc.lng;
            } else if (uname == "Will") {
                $scope.baselat = $scope.cities[3].loc.lat;
                $scope.baselng = $scope.cities[3].loc.lng;
            } else if (uname == "Mary") {
                $scope.baselat = $scope.cities[6].loc.lat;
                $scope.baselng = $scope.cities[6].loc.lng;
            } else {
                console.log("1deamaxwu ---> undefault location.")
            }
            console.log("1deamaxwu ---> location: (" + $scope.baselat + ',' + $scope.baselng + ')')

        }

        function UserPosition() {
            console.log("1deamaxwu ---> interval as UserPosition")

            var lat = $scope.baselat + (Math.round(Math.random()) * 2 - 1) * Math.random() * 0.025;
            var lng = $scope.baselng + (Math.round(Math.random()) * 2 - 1) * Math.random() * 0.025;

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
                    draggable: true,
                    options: {
                        icon: 'res/gopher.png',
                    }
                },
                message: "Your location: ",
                events: {
                    dragend: function(marker, eventName, args) {
                        var lti = marker.getPosition().lat();
                        var lon = marker.getPosition().lng();
                        console.log("1deamaxwu ---> marker dragend: " + lti + ',' + lon);

                        $scope.mylocation.options = {
                            draggable: true,
                            icon: 'res/gopher.png',
                            labelContent: "(" + $scope.mylocation.coords.latitude.toFixed(6) + ', ' + $scope.mylocation.coords.longitude.toFixed(6) + ')',
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

            off = 10.0
            var record = '{\"recordId\": uuid(\"' + guid() + '\"),\"user_id\":\"' + SessionStorage.get('userId') + '\",\"latitude\":' + lat + ',\"longitude\":' + lng + ',\"timeoffset\":' + off + ',\"timestamp\":datetime(\"' + getFDate() + '\")}';


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
                GetHistory();
            } else {
                console.log("1deamaxwu ---> subscribe ERROR: " + data['data']['error']);
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
                console.log("1deamaxwu ---> feed record ERROR: " + data['data']['error']);
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
        var logoutSuccessFunction = function(data) {
            console.log("1deamxwu ---> logout respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
                //$scope.dataStream.close();
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

        function GetHistory() {
            var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));
            if (SessionStorage.get("notiHistory") != null) {
                console.log("1deamaxwu ---> NOT NULL!");
                SessionStorage.removeElement("notiHistory");
                $scope.notiHistory = [];
            }
            if (subscriptionList != null) {

                for (var i = 0; i < subscriptionList.length; i++) {
                    item = subscriptionList[i].split("::");
                    channelName = item[2];

                    //$scope.ackUserSubscriptionId = subscriptionList[i];
                    //$scope.ackChannelName = channelName;

                    console.log("1deamxwu ---> SUB_name: " + channelName);
                    NotificationGetter.getHistory($scope.userId, $scope.accessToken, subscriptionList[i],
                        getFDate(), channelName, SessionStorage.get('brokerUrl'), historySuccessFunction, errorFunction);
                    //NotificationGetter.getNewResults($scope.userId, $scope.accessToken, subscriptionList[i],
                    //getFDate(), channelName, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
                }
            }
        }

        $scope.logoutUser = function() {
            NotificationGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        }

        $scope.init = function() {
            $scope.alertmsg = "";
            $scope.alertjump = "";
            $scope.mylocation = '';
            $scope.orderByField = 'timestamp';
            $scope.reverseSort = true;
            $scope.showtype = "incoming"

            $scope.userId = SessionStorage.get('userId');
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.subscriptionId = SessionStorage.get('subscriptionId');
            $scope.latestTimeStamp = SessionStorage.get('timestamp');
            console.log("1deamaxwu ---> current userId: " + $scope.userId);
            $scope.cities = EmergenciesGetter.citylist;
			
			$scope.colors = EmergenciesGetter.colorlist;
			
            SessionStorage.conf();

            $scope.notiHistory = JSON.parse(SessionStorage.get('notiHistory')) == null ? [] : JSON.parse(SessionStorage.get('notiHistory'));
            $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
            $scope.numNoti = SessionStorage.get('numNoti') == null ? 0 : SessionStorage.get('numNoti');
            $scope.markers = JSON.parse(SessionStorage.get('markers')) == null ? [] : JSON.parse(SessionStorage.get('markers'));
            $scope.shelters = JSON.parse(SessionStorage.get('shelters')) == null ? [] : JSON.parse(SessionStorage.get('shelters'));
            $scope.circles = JSON.parse(SessionStorage.get('circles')) == null ? [] : JSON.parse(SessionStorage.get('circles'));

            DataShowRender();

            $scope.map = {
                center: {
                    latitude: $scope.cities[2].loc.lat,
                    longitude: $scope.cities[2].loc.lng
                },
                zoom: 12,
                events: {
                    click: function(mapModel, eventName, args) {
                        console.log("1deamaxwu ---> marker click: " + args[0].latLng.lng());
                        //if ($scope.locselection == "onmap") {
                        cmlat = args[0].latLng.lat();
                        cmlng = args[0].latLng.lng();

                        $scope.mylocation.coords.latitude = cmlat;
                        $scope.mylocation.coords.longitude = cmlng;

                        $scope.baselat = cmlat;
                        $scope.baselng = cmlng;

                        updateInterSect($scope.mylocation.coords);

                        $scope.$apply();

                        //} else {
                        //console.log("1deamaxwu ---> only marker click.");
                        //}
                    }
                }
            };
            $scope.options = {
                scrollwheel: false
            };

            $scope.control = {};

            initBaseLoc();
            UserPosition();
            MyLoc();

            NotificationGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'),
                subscribeSuccessFunction, errorFunction);
        }
    }
]);
