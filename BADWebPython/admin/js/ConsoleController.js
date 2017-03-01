app.controller('ConsoleController', ['$scope', '$window', 'ConsoleGetter', 'SessionStorage', function($scope, $window,
    AsterixIndexGetter, SessionStorage) {
    SessionStorage.conf();
    $scope.userId = SessionStorage.get('testId');
    /*
    if ($scope.userId == null){
    	console.log("1deamaxwu ---> no access!");
    	$window.location.href = '/';
    } else {
    
    }
    
    //console.log("1deamaxwu ---> login "+$scope.userId);
    var successFunction = function(data) {
        console.log("1deamxwu ---> login in user respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logined user success as " + data['data']['userId']);
            SessionStorage.set('accessToken', data['data']['accessToken']);
            SessionStorage.set('userId', data['data']['userId']);
            $window.location.href = '/notifications.html';
        } else {
            console.log("1deamaxwu ---> login user ERROR: " + data['data']['error'])
            $window.alert(data['data']['error']);
        }
    }

    var subscribeSuccessFunction = function(data) {
        console.log("1deamaxwu ---> login as new user and going to subscribe");
        SessionStorage.set('accessToken', data['data']['accessToken']);
        SessionStorage.set('userId', data['data']['userId']);
        $window.location.href = '/subscriptions.html';

    }

    var registerSuccessFunction = function(data) {
        console.log("1deamxwu ---> register user respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> registered user success as " + data['data']['userId']);
            //SessionStorage.set('userId', data['data']['userId']);
            $scope.loginUser($scope.newUserName, $scope.newUserPassword, false);
        } else {
            console.log("1deamaxwu ---> register user ERROR: " + data['data']['error'])
            $window.alert(data['data']['error']);
        }

    }

    var errorFunction = function(data) {
        console.log("1deamxwu ---> respond ERROR: " + data['data']);
        $window.alert(data['data']);
    }
*/
    //$scope.userId = '';
    //$scope.userPassword = '';

    $scope.loginUser = function(userId, userPassword, fromHtml) {
        $scope.isActive = true;
        $scope.userId = userId;
        $scope.userPassword = userPassword;
        if (fromHtml) {
            IndexGetter.postUserData($scope.userId, $scope.userPassword, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
        } else {
            IndexGetter.postUserData($scope.userId, $scope.userPassword, SessionStorage.get('brokerUrl'), subscribeSuccessFunction, errorFunction);
        }

    };

    $scope.signIn = function(userName, password) {
        //$scope.newUserName = newUserName;
        //$scope.newUserPassword = newUserPassword;
        //$scope.newUserEmail = newUserEmail;
        //IndexGetter.postRegisterUser($scope.newUserName, $scope.newUserPassword, $scope.newUserEmail, SessionStorage.get('brokerUrl'),
        //    registerSuccessFunction, errorFunction);
        SessionStorage.set('testId', "admin");
        console.log("1deamxwu ---> login as " + SessionStorage.get('userId'));
        $window.location.href = 'admin/asterixconsole.html';
    }

    $scope.logoutUser = function() {
        //$scope.dataStream.close();
        //SubscriptionGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        SessionStorage.removeElement('testId');
        console.log("1deamxwu ---> logout");
        $window.location.href = '/';
    }
}]);
