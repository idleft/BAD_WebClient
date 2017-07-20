app.controller('PublishController', ['$scope', '$window', 'PublishGetter', 'BrokerDiscoveryGetter', 'SessionStorage', function($scope, $window,
    PublishGetter, BrokerDiscoveryGetter, SessionStorage) {
    
    
    var successFunction = function(data) {
        console.log("1deamxwu ---> login in user respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logined user success as " + data['data']['userId']);
            SessionStorage.set('pubaccessToken', data['data']['accessToken']);
            SessionStorage.set('pubuserId', data['data']['userId']);
            SessionStorage.set('pubuserName', $scope.userName);
            $window.location.href = 'upload.html';
        } else {
            console.log("1deamaxwu ---> login user ERROR: " + data['data']['error'])
            if(data['data']['error'].includes('already logged in')){
            	$scope.alertmsg = data['data']['error'];
            	$("#staychoice").modal('show');
            } else {
            	$scope.alertmsg = data['data']['error'];
            	$("#alertmodal").modal('show');
            }
        }
    }

    var altSuccessFunction = function(data) {
        console.log("1deamaxwu ---> login as new user and going to subscribe");
        SessionStorage.set('pubaccessToken', data['data']['accessToken']);
        SessionStorage.set('pubuserId', data['data']['userId']);
        SessionStorage.set('pubuserName', $scope.userName);
        $window.location.href = 'upload.html';

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
	
    $scope.rolebtn = function() {
        console.log("1deamxwu ---> Welcome Loki!");
        $scope.userName = "Loki";
        $scope.userPassword = "clinton";
        PublishGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), true, successFunction, errorFunction);
    }

	$scope.tryrole = function() {
        $("#rolechoice").modal('show');
    }
    
    $scope.loginUser = function(userName, userPassword, fromHtml, stay) {
        $scope.userName = userName;
        $scope.userPassword = userPassword;
        if ($scope.userName != null && $scope.userPassword != null) {
            if (fromHtml) {
                PublishGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), stay, successFunction, errorFunction);
            } else {
                PublishGetter.postUserData($scope.userName, $scope.userPassword, SessionStorage.get('brokerUrl'), stay, altSuccessFunction, errorFunction);
            }
        } else {
            $scope.alertmsg = "Invalid Inputs!";
            $("#alertmodal").modal('show');
        }

    };

    $scope.registerUser = function(newUserName, newUserPassword, newUserEmail) {
        //$scope.alertmsg = "Only Loki can publish!";
        //$("#alertmodal").modal('show');
        $scope.newUserName = newUserName;
        $scope.newUserPassword = newUserPassword;
        $scope.newUserEmail = newUserEmail;
        if ($scope.newUserName != null && $scope.newUserPassword != null) {
        	if ($scope.newUserEmail == null){
        		$scope.newUserEmail = $scope.newUserName + "@bad.com";
        	}
            PublishGetter.postRegisterUser($scope.newUserName, $scope.newUserPassword, $scope.newUserEmail, SessionStorage.get('brokerUrl'), registerSuccessFunction, errorFunction);
        } else {
            $scope.alertmsg = "Invalid Inputs!";
            $("#alertmodal").modal('show');
        }
    }
    
    $scope.init = function(){
    	//SessionStorage.conf();
    	BrokerDiscoveryGetter.getBroker();
    	$scope.alertmsg = "";
    	$scope.showemail = false;
    	//$("#rolechoice").modal('show');
    }
    
}]);
