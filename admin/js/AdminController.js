app.controller('AdminController', ['$scope', '$window', 'AdminGetter', 'SessionStorage', function($scope, $window,
    AsterixIndexGetter, SessionStorage) {
    SessionStorage.conf();
    $scope.userId = SessionStorage.get('userId');
    if ($scope.userId == null){
    	console.log("1deamaxwu ---> no access!");
    	$window.location.href = '/';
    } else {
    	
    }
    //console.log("1deamaxwu ---> login "+$scope.userId);
    $scope.signIn = function(userName, password) {
        SessionStorage.set('userId', "admin");
        console.log("1deamxwu ---> login as " + SessionStorage.get('userId'));
        $window.location.href = 'admin/asterixconsole.html';
    }
    $scope.logoutUser = function() {
        //$scope.dataStream.close();
        //SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        SessionStorage.remove();
        console.log("1deamxwu ---> logout");
        $window.location.href = '/';
    }
}]);
