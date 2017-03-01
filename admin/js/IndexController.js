app.controller('IndexController', ['$scope', '$window', 'IndexGetter', 'SessionStorage', function($scope, $window,
    AsterixIndexGetter, SessionStorage) {
    SessionStorage.conf();
    $scope.userId = SessionStorage.get('testId');
    /*
    if ($scope.userId == null){
    	console.log("1deamaxwu ---> no access!");
    } else {
    	$window.location.href = 'admin/asterixconsole.html';
    }
    */
    //console.log("1deamaxwu ---> login "+$scope.userId);
    $scope.signIn = function(userName, password) {
        SessionStorage.set('testId', "admin");
        console.log("1deamxwu ---> login as " + SessionStorage.get('testId'));
        $window.location.href = 'admin/asterixconsole.html';
    }
}]);
