app.controller('IndexController', ['$scope', '$window', 'IndexGetter', 'SessionStorage', function($scope, $window,
    AsterixIndexGetter, SessionStorage) {
    
    $scope.signIn = function(userName, password) {
        SessionStorage.set('testId', "admin");
        $scope.userId = SessionStorage.get('testId');
        console.log("1deamxwu ---> login as " + SessionStorage.get('testId'));
        
        $scope.alertmsg = "Not Ready! Try Publish or Subscriber!";
        $("#alertmodal").modal('show');
    }
    
    $scope.signUp = function(){
    	$scope.alertmsg = "Not Ready! Try Publish or Subscriber!";
        $("#alertmodal").modal('show');
    }
    
    $scope.mgrDash = function(){
    	$scope.alertmsg = "Not Ready! Try Publish or Subscriber!";
        $("#alertmodal").modal('show');
    }
    
    $scope.moreDash = function(){
    	$scope.alertmsg = "Not Ready! Try Publish or Subscriber!";
        $("#alertmodal").modal('show');
    }
    
    $scope.init = function(){
    	//SessionStorage.conf();
    	$scope.alertmsg = "";
    }
}]);
