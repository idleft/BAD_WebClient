app.controller('SubscriptionCtrl', ['$scope', '$window', '$filter', '$websocket', 'SessionStorage', 'SubscriptionGetter', 'geolocationService', 'EmergenciesGetter', function($scope, $window, $filter, $websocket, SessionStorage, SubscriptionGetter, geolocationService, EmergenciesGetter) {

    Array.prototype.contains = function(obj) {
        var i = this.length;
        while (i--) {
            if (this[i] == obj) {
                return true;
            }
        }
        return false;
    }
    Array.prototype.removeValue = function(name, value) {
        var array = $.map(this, function(v, i) {
            return v[name] === value ? null : v;
        });
        this.length = 0; //clear original array
        this.push.apply(this, array); //push all elements except the one we want to delete
    } //countries.results.removeValue('name', 'Albania');

    $scope.map = {
        center: {
            latitude: 39.7642548,
            longitude: -104.9951939
        },
        zoom: 7
    };
    $scope.options = {
        scrollwheel: false
    };

    $scope.control = {};

    var bounds = new google.maps.LatLngBounds();

    var searchAddressInput = document.getElementById('pac-input');
    var autocomplete = new google.maps.places.Autocomplete(searchAddressInput);

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

    $scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }

    $scope.addLocation = function() {

        console.log("1deamaxwu ---> addding location: " + $scope.addmarker + ", name: " + $scope.address);

        if ($scope.addresses.contains($scope.address)) {
            $scope.alertmsg = "Duplicated Location!";
            $("#alertmodal").modal('show');
            $scope.alertjump = '';

        } else {
            $scope.addresses.push($scope.address);
            $scope.addmarkers.push($scope.addmarker);
            console.log("1deamaxwu ---> addresses: " + $scope.addresses);
            for (var i = 0, length = $scope.addmarkers.length; i < length; i++) {
                var marker = $scope.addmarkers[i].coords;
                bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
            }
            $scope.control.getGMap().fitBounds(bounds);
        }

    }

    $scope.locChange = function() {
        if ($scope.locselection == "NearMe") {
            $scope.addresses = [];
            $scope.addmarkers = [];

            //$scope.$apply();
            console.log("1deamaxwu ---> getting my location...");
            UserPosition();
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
            $scope.addmarkers.push(marker);
            bounds.extend(new google.maps.LatLng(marker.coords.latitude, marker.coords.longitude));
            $scope.control.getGMap().fitBounds(bounds);
            //$scope.$apply();
        }
        if ($scope.locselection == "Location") {
            $scope.addresses = [];
            $scope.addmarkers = [];

            autocomplete.addListener('place_changed', function() {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    console.log("1deamaxwu ---> Autocomplete returned place contains no geometry");
                    return;
                } else {

                    $scope.address = place.name;
                    $scope.addmarker = {
                        id: Date.now(),
                        coords: {
                            latitude: place.geometry.location.lat(),
                            longitude: place.geometry.location.lng()
                        },
                        title: $scope.address
                    };
                    console.log("1deamaxwu ---> place: " + $scope.addmarker.coords + ', name: ' + $scope.address);
                }
            });
        }
    }

    $scope.deleteSubs = function(id, name) {
        console.log("1deamxwu ---> DELETE: " + name);
        $scope.sublist.removeValue('id', id);
        SubscriptionGetter.deleteSub($scope.userId, $scope.accessToken, id, SessionStorage.get('brokerUrl'), deleteSubSuccessFunction, errorFunction);
    }

    var successFunction = function(data) {
        console.log("1deamxwu ---> subscription respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> subscriptioned success as " + data['data']['userSubscriptionId']);
            SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
            SessionStorage.set('timestamp', data['data']['timestamp']);
            $scope.alertmsg = "Subscribed!";
            $("#alertmodal").modal('show');
            $scope.alertjump = 'notifications.html';
        } else {
            console.log("1deamaxwu ---> subscription ERROR: " + data['data']['error']);
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
            }
        }
    }
    var deleteSubSuccessFunction = function(data) {
        console.log("1deamxwu ---> delete sub respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> delete sub success.");

        } else {
            console.log("1deamaxwu ---> delete sub ERROR: " + data['data']['error']);
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
    var subscribeSuccessFunction = function(data) {
        console.log("1deamxwu ---> get subscribtion respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> got subcribtion success as " + data['data']['subscriptions']);

            if (SessionStorage.get("subscriptionId") != null) {
                SessionStorage.removeElement("subscriptionId");
                $scope.sublist = []
            }
            if (data['data']['subscriptions'] != null) {
                for (var i = 0; i < data['data']['subscriptions'].length; i++) {
                    SessionStorage.set('subscriptionId', data['data']['subscriptions'][i]["userSubscriptionId"]);
                    paras = data['data']['subscriptions'][i]["parameters"].split(",");

                    if (paras.length > 0) {
                        if (paras.length == 1) {
                            sub = {
                                'id': data['data']['subscriptions'][i]["userSubscriptionId"],
                                'name': paras[0]
                            };
                            $scope.sublist.push(sub);
                        } else if (paras.length == 2) {
                            sub = {
                                'id': data['data']['subscriptions'][i]["userSubscriptionId"],
                                'name': paras[0] + ' NearMe'
                            };
                            if (data['data']['subscriptions'][i]["channelName"].includes("Shelter")) {
                                sub.name += " with Shelter";
                            }
                            $scope.sublist.push(sub);
                        } else if (paras.length == 3) {
                            sub = {
                                'id': data['data']['subscriptions'][i]["userSubscriptionId"],
                                'name': paras[0] + ' @(' + parseFloat(paras[1]).toFixed(6) + ',' + parseFloat(paras[2]).toFixed(6) + ')'
                            };
                            if (data['data']['subscriptions'][i]["channelName"].includes("Shelter")) {
                                sub.name += " with Shelter";
                            }
                            $scope.sublist.push(sub);
                        } else {
                            console.log("1deamaxwu ---> Too much paras!");
                        }
                    }
                }
            }
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
        $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
        console.log($scope.dataStream);
        $scope.dataStream.onMessage($scope.parseMessage);

    };
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

    var errorFunction = function(data) {
        console.log("1deamaxwu ---> reponse ERROR: " + data['data']);
        $scope.alertmsg = "Error Connection! " + data['data'];
        $("#alertmodal").modal('show');
        $scope.alertjump = "";
    };

    function UserPosition() {

        var baselat = 33.6869803;
        var baselng = -117.8442917;


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
        } else if (uname == "Mary") {
            baselat = 48.1548895;
            baselng = 11.4717964;
        } else {
            console.log("1deamaxwu ---> undefault location.")
        }
        console.log("1deamaxwu ---> location: (" + baselat + ',' + baselng + ')')

        $scope.mylocation = {
            latitude: baselat,
            longitude: baselng
        };
        console.log("1deamxwu ---> get position latitude: " + baselat + " longitude: " + baselng);
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
            $scope.alertmsg = "Please Select A Type!";
            $("#alertmodal").modal('show');
            $scope.alertjump = "";
        }
        $scope.accessToken = SessionStorage.get('accessToken');
        $scope.userId = SessionStorage.get('userId');


        // shelter, location and type
        if ($scope.shelterInfo) {
            if ($scope.locselection != "") {

                //recentIptMsgofEmergenciesOfTypeWithShelterIntUserChannel
                if ($scope.locselection == "NearMe") {
                    console.log("1deamxwu ---> SHELTER and NEARME and TYPE.")
                    UserPosition();
                    var subscriptionList = getSubscriptionList();
                    for (i = 0; i < subscriptionList.length; i++) {
                        SubscriptionGetter.postIptMsgofEmergenciesOfTypeWithShelterIntUserSubscription($scope.userId, $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                    }

                    //recentEmergenciesOfTypeAtLocationWithShelterchannel
                } else if ($scope.locselection == "Location") {
                    console.log("1deamxwu ---> SHELTER and LOCATION and TYPE.")
                    if ($scope.addmarkers.length == 0) {
                        $scope.alertmsg = "Please Add a Location!";
                        $("#alertmodal").modal('show');
                        $scope.alertjump = "";
                    }
                    for (var j = 0, length = $scope.addmarkers.length; j < length; j++) {
                        var marker = $scope.addmarkers[j].coords;
                        for (i = 0; i < subscriptionList.length; i++) {
                            SubscriptionGetter.postEmergenciesLocationWithShelterSubscription($scope.userId, marker, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                        }
                    }
                } else {
                    console.log("1deamxwu ---> some implicit error.")
                }
            } else {
                console.log("1deamxwu ---> SHELTER without LOCATION.")
                $scope.alertmsg = "Shelter without Location!";
                $("#alertmodal").modal('show');
                $scope.alertjump = "";
            }

            //location and type
        } else if ($scope.locselection != "") {

            //recentIptMsgofEmergenciesOfTypeIntUserChannel
            if ($scope.locselection == "NearMe") {
                console.log("1deamxwu ---> NEARME and TYPE.")
                UserPosition();
                var subscriptionList = getSubscriptionList();
                for (i = 0; i < subscriptionList.length; i++) {
                    SubscriptionGetter.postIptMsgofEmergenciesOfTypeIntUserSubscription($scope.userId, $scope.mylocation, $scope.accessToken, subscriptionList[i], SessionStorage.get('brokerUrl'), successFunction, errorFunction)
                }

                //recentEmergenciesOfTypeAtLocationChannel
            } else if ($scope.locselection == "Location") {
                console.log("1deamxwu ---> LOCATION and TYPE.")
                if ($scope.addmarkers.length == 0) {
                    $scope.alertmsg = "Please Add a Location!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
                for (var j = 0, length = $scope.addmarkers.length; j < length; j++) {
                    var marker = $scope.addmarkers[j].coords;
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
    $scope.init = function() {
        SessionStorage.conf();

        $scope.address = '';
        $scope.addresses = [];
        $scope.addmarkers = [];
        $scope.alertmsg = "";
        $scope.alertjump = "";
        $scope.chkbxs = EmergenciesGetter.emergencytpye;
        $scope.sublist = []
        $scope.mylocation = '';
        $scope.locselection = "";
        $scope.shelterInfo = false;

        $scope.accessToken = SessionStorage.get('accessToken');
        $scope.userId = SessionStorage.get('userId');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('userId'))

        $scope.messages = JSON.parse(SessionStorage.get('messages')) == null ? [] : JSON.parse(SessionStorage.get('messages'));
        $scope.markers = JSON.parse(SessionStorage.get('markers')) == null ? [] : JSON.parse(SessionStorage.get('markers'));
        $scope.shelters = JSON.parse(SessionStorage.get('shelters')) == null ? [] : JSON.parse(SessionStorage.get('shelters'));;
        $scope.circles = JSON.parse(SessionStorage.get('circles')) == null ? [] : JSON.parse(SessionStorage.get('circles'));;
        $scope.numNoti = SessionStorage.get('numNoti') == null ? 0 : SessionStorage.get('numNoti');

        SubscriptionGetter.getSubscriptions($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'),
            subscribeSuccessFunction, errorFunction);
    }
}]);
