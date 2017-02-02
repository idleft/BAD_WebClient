app.controller('IndexController', ['$scope', '$window', 'IndexGetter', 'SessionStorage', function($scope, $window,
    AsterixIndexGetter, SessionStorage) {
    SessionStorage.conf();
    $scope.userId = SessionStorage.get('userId');
    if ($scope.userId == null){
    	console.log("1deamaxwu ---> no access!");
    } else {
    	$window.location.href = 'admin/asterixconsole.html';
    }
    //console.log("1deamaxwu ---> login "+$scope.userId);
    $scope.signIn = function(userName, password) {
        SessionStorage.set('userId', "admin");
        console.log("1deamxwu ---> login as " + SessionStorage.get('userId'));
        $window.location.href = 'admin/asterixconsole.html';
    }
}]);
