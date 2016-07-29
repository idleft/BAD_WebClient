app.controller('MainController', ['$scope', '$interval', '$websocket', '$window', '$location', 'HttpGetter',
    'SessionStorage', function ($scope, $interval, $websocket, $window, $location, HttpGetter, SessionStorage) {

        $scope.messages = [];
        $scope.msgChannelName = '';

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
                        'coordinates': zone[0] + "," + zone[1],
                        'radius': zone[2],
                        'message': data['data']['results'][i]['message'],
                        'timestamp': data['data']['results'][i]['timestamp'],
                        'msgChannelName': data['data']['channelName']
                    }
                    $scope.messages.push(message);
                }
            }
            $scope.messages.reverse();
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
                $scope.latestTimeStamp = data['timestamp'];
                console.log("timestamp:" + $scope.latestTimeStamp);
                SessionStorage.set('timestamp', $scope.latestTimeStamp);
                HttpGetter.getNewResults($scope.userId, $scope.accessToken, $scope.subscriptionId,
                    $scope.latestTimeStamp, data['channelName'], successFunction, errorFunction);
            }
        }

        $scope.logoutUser = function () {
            $scope.dataStream.close();
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

            console.log('SAFIR-->Creating Web Socket');
            socketAddress = "ws://" + $location.host() + ":8989/websocketlistener";
            console.log(socketAddress);
            $scope.dataStream = $websocket(socketAddress);
            $scope.dataStream.onMessage($scope.parseMessage);
        }

    }]);
