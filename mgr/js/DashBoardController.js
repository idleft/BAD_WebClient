app.controller('DashBoardController', ['$scope', '$window', 'DashBoardGetter', 'SessionStorage', function($scope, $window, DashBoardGetter, SessionStorage) {
    SessionStorage.conf();
    $scope.userId = SessionStorage.get('userId');
    if ($scope.userId == null) {
        console.log("1deamaxwu ---> no access!");
        $window.location.href = 'index.html';
    } else {

    }
    var successFunction = function(data) {
        console.log("1deamxwu ---> register application respond success");
        if (data['data']['status'] == 'success') {
            console.log('1deamxwu ---> register application Success as ' + data['data']['appName']);
            $window.location.href = '/index.html';
        } else {
            console.log("1deamaxwu ---> register application ERROR: " + data['data']['error'])
            $window.alert(data['data']['error']);
        }

    };
    var errorFunction = function(data) {
        console.log("1deamxwu ---> respond ERROR: " + data['data']);
        $window.alert(data['data']);
    };
    $scope.registerUser = function(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL) {
        RegisterAppGetter.postRegisterAppData(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL, SessionStorage.get('brokerUrl'), successFunction, errorFunction);

    };
    $scope.logoutUser = function() {
        //$scope.dataStream.close();
        //SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        SessionStorage.remove();
        console.log("1deamxwu ---> logout");
        $window.location.href = 'index.html';
    }
}]);
