app.controller('SubscriptionCtrl', ['$scope', '$filter', 'SessionStorage', 'SubscriptionGetter', 'geolocationService',
    function ($scope, $filter, SessionStorage, geolocationService) {

        console.log("In SubscriptionCtrl");

        $scope.accessToken = SessionStorage.get('accessToken');
        $scope.userId = SessionStorage.get('userId');
        $scope.chkbxs = [{label: "Earthquake", val: false},
            {label: "Hurricane", val: false},
            {label: "Tornado", val: false},
            {label: "Flood", val: false},
            {label: "Shooting", val: false}
        ];


        var successFunction = function (data) {
            console.log("All is well with subscriptions!");
            SessionStorage.set('subscriptionId', data['data']['userSubscriptionId']);
            SessionStorage.set('timestamp', data['data']['timestamp']);

            $window.location.href = '/notifications';
        };

        var errorFunction = function (data) {
            console.log("Something went wrong: " + data);
        };

        function UserPosition(position) {
            console.log("in UserPosition");
            var lat = position.coords.latitude;
            var lng = position.coords.longitude;
            $scope.mylocation = {latitude: lat, longitude: lng};
            console.log("latitude" + lat);
        }

        $scope.onClickNearMe = function () {
            console.log("In onClickNearMe");
            if ($scope.nearMe) {
                geolocationService.getCurrentPosition().then(UserPosition);

            }


        };

        $scope.subscribeToEmergencies = function () {
            $scope.isActive = true;
            var subscriptionList = $filter("filter")($scope.chkbxs, {val: true});
            for (var i = 0; i < subscriptionList.length; i++) {
                subscriptionList[i] = angular.toLowerCase(subscriptionList[i].label);
            }
            console.log(subscriptionList);
            $scope.accessToken = SessionStorage.get('accessToken');
            $scope.userId = SessionStorage.get('userId');

            SubscriptionGetter.postEmergenciesSubscription($scope.userId, $scope.accessToken, subscriptionList,
                successFunction, errorFunction);

        };


    }]);