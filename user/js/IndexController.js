app.controller('IndexController', ['$scope', '$window', 'IndexGetter', 'SessionStorage', 'BrokerDiscoveryGetter', function($scope, $window,
    IndexGetter, SessionStorage, BrokerDiscoveryGetter) {
    
    var successFunction = function(data) {
        console.log("1deamxwu ---> login in user respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logined user success as " + data['data']['userId']);
            SessionStorage.set('accessToken', data['data']['accessToken']);
            SessionStorage.set('userId', data['data']['userId']);
            SessionStorage.set('userName', $scope.userName);
            $window.location.href = 'notifications.html';
        } else {
        	if(data['data']['error'].includes('already logged in')){
            	$scope.alertmsg = data['data']['error'];
            	$("#staychoice").modal('show');
            } else {
            	console.log("1deamaxwu ---> login user ERROR: " + data['data']['error'])
            	$scope.alertmsg = data['data']['error'];
            	$("#alertmodal").modal('show');
            }
        }
    }

    var altSuccessFunction = function(data) {
        console.log("1deamaxwu ---> login as new user and going to subscribe");
        SessionStorage.set('accessToken', data['data']['accessToken']);
        SessionStorage.set('userId', data['data']['userId']);
        SessionStorage.set('userName', $scope.userName);
        $window.location.href = 'subscriptions.html';

    }

    var registerSuccessFunction = function(data) {
        console.log("1deamxwu ---> register user respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> registered user success as " + data['data']['userId']);
            $scope.loginUser($scope.newUserName, $scope.newUserPassword, false, true);
        } else {
            console.log("1deamaxwu ---> register user ERROR: " + data['data']['error'])
            $scope.alertmsg = data['data']['error'];
            $("#alertmodal").modal('show');
        }

    }

    var errorFunction = function(data) {
        console.log("1deamxwu ---> respond ERROR: " + data['data']);
        $scope.alertmsg = "Error Connection! " + data['data'];
        $("#alertmodal").modal('show');
    }
    
    $scope.staybtn = function(){
		$scope.loginUser($scope.userName, $scope.userPassword, false, false);
	}
	
    $scope.tryrole = function() {
        $("#rolechoice").modal('show');
    }
    
    $scope.rolebtn = function(myrole) {
        if (myrole == null) {
            console.log("1deamxwu ---> NO role choice");
        } else if (myrole == "Other") {
            console.log("1deamxwu ---> Role choice: Other");
        } else {
            console.log("1deamxwu ---> Role choice: " + myrole);
            $scope.userName = myrole;
            $scope.userPassword = "trump";
            IndexGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), true, successFunction, errorFunction);
        }
    }
    $scope.loginUser = function(userName, userPassword, fromHtml, stay) {
        $scope.userName = userName;
        $scope.userPassword = userPassword;
        if ($scope.userName != null && $scope.userPassword != null) {
            if (fromHtml) {
                IndexGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), stay, successFunction, errorFunction);
            } else {
                IndexGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), stay, altSuccessFunction, errorFunction);
            }
        } else {
            $scope.alertmsg = "Invalid Inputs!";
            $("#alertmodal").modal('show');
        }

    };

    $scope.registerUser = function(newUserName, newUserPassword, newUserEmail) {
        $scope.newUserName = newUserName;
        $scope.newUserPassword = newUserPassword;
        $scope.newUserEmail = newUserEmail;
        if ($scope.newUserName != null && $scope.newUserPassword != null) {
        	if ($scope.newUserEmail == null){
        		$scope.newUserEmail = $scope.newUserName + "@bad.com";
        	}
            IndexGetter.postRegisterUser($scope.newUserName, $scope.newUserPassword, $scope.newUserEmail, SessionStorage.get('brokerUrl'), registerSuccessFunction, errorFunction);
        } else {
            $scope.alertmsg = "Invalid Inputs!";
            $("#alertmodal").modal('show');
        }
    }

    $scope.init = function() {
        //SessionStorage.conf();
        BrokerDiscoveryGetter.getBroker();
        $scope.alertmsg = "";
        $scope.showemail = false;
        //$("#rolechoice").modal('show');
    }
}]);
