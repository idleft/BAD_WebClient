app.controller('MainController', ['$scope', '$interval', '$websocket', '$window', '$location', 'HttpGetter',
    'SessionStorage','geolocationService', function($scope, $interval, $websocket, $window, $location, HttpGetter, SessionStorage, geolocationService) {

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
            console.log("In renderMap()");

            for (var i = 0, length = $scope.markers.length; i < length; i++) {
                var marker = $scope.markers[i].coords;
                console.log(marker);
                bounds.extend(new google.maps.LatLng(marker.latitude, marker.longitude));
            }
            $scope.control.getGMap().fitBounds(bounds);

        }


        var successFunction = function (data) {
            console.log("SAFIR-->All is well with new results!");

            console.log(data);

            $scope.messages.reverse();

            if (data['data']['results'] != null) {

                for (i = 0; i < data['data']['results'].length; i++) {
                    var d = data['data']['results'][i]['impactZone'].toString();
                    var zone = d.split(",");

                    var message = {
                        'emergencytype': data['data']['results'][i]['emergencyType'],
                        'severity': data['data']['results'][i]['severity'],
                        'center': {latitude: zone[0], longitude: zone[1]},
                        'coordinates': zone[0] + "," + zone[1],
                        'radius': zone[2],
                        'message': data['data']['results'][i]['message'],
                        'timestamp': data['data']['results'][i]['timestamp'],
                        'msgChannelName': data['data']['channelName']
                    }
                    $scope.messages.push(message);
                    var marker = {
                        id: Date.now(),
                        coords: {
                            latitude: zone[0],
                            longitude: zone[1]
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
            console.log("in UserPosition");

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
            console.log("latitude" + lat);
            HttpGetter.feedRecords($scope.userId, $scope.accessToken, portNo,
                record, userSuccessFunction, errorFunction);
        }
        $interval(function(){
            UserPosition();
            // var d=geolocationService.getCurrentPosition().then(UserPosition);
            // d.then(console.log("Location updated"));
        },10000);


        var subscribeSuccessFunction = function (data) {
            console.log("Retrieved subscriptions successfully!");
            console.log(data);

            SessionStorage.removeElement("subscriptionId");

            for (var i = 0; i < data['data']['subscriptions'].length; i++) {
                SessionStorage.set('subscriptionId', data['data']['subscriptions'][i]["userSubscriptionId"]);
            }

            console.log('SAFIR-->Creating Web Socket');

            var socketAddress = "ws://" + $location.host() + ":8989/websocketlistener";

            console.log(socketAddress);

            $scope.dataStream = $websocket(socketAddress);
            $scope.dataStream.onMessage($scope.parseMessage);
        };

        var userSuccessFunction = function (data) {
            console.log("All is well: " + data);
        }        

        var errorFunction = function (data) {
            console.log("Something went wrong: " + data);
        }

        $scope.parseMessage = function (message) {
            console.log('Received websocket message from the server');
            var data = JSON.parse(message.data);
            console.log(data);
            console.log($scope.userId);
            console.log(data['userId']);

            if ($scope.userId == data['userId']) {
                $scope.latestTimeStamp = data['channelExecutionTime'];

                console.log("channelExecutionTime:" + $scope.latestTimeStamp);
                //SessionStorage.set('timestamp', $scope.latestTimeStamp);

                var subscriptionList = JSON.parse(SessionStorage.get('subscriptionId'));
                console.log("Printing:" + subscriptionList);

                function findSubcription(subscriptionId) {
                    return subscriptionId == data['userSubscriptionId'];
                }

                if (undefined != subscriptionList.find(findSubcription)) {
                    HttpGetter.getNewResults($scope.userId, $scope.accessToken, data['userSubscriptionId'],
                        $scope.latestTimeStamp, data['channelName'], successFunction, errorFunction);
                }
            }
        }

        $scope.logoutUser = function () {
            $scope.dataStream.close();

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

            HttpGetter.getSubscriptions($scope.userId, $scope.accessToken,
                subscribeSuccessFunction, errorFunction);
        }
    }]);
