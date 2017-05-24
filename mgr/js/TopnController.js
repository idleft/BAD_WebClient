app.controller('TopnController', ['$scope', '$interval', '$window', '$filter', 'TopnGetter', 'FuncGetter', 'SessionStorage', function($scope, $interval, $window, $filter, TopnGetter, FuncGetter, SessionStorage) {
	
    $scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }
	
    var logoutSuccessFunction = function(data) {
        console.log("1deamxwu ---> logout respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
            SessionStorage.removeElement("mgraccessToken");
            SessionStorage.removeElement("mgruserId");
            SessionStorage.removeElement("mgruserName");
            $window.location.href = 'index.html';
        } else {
            console.log("1deamaxwu ---> logged out ERROR: " + data['data']['error']);
            if (data['data']['error'] == "Invalid access token") {
                $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'index.html';
            } else if (data['data']['error'] == "User is not authenticated") {
                $scope.alertmsg = "User is not authenticated! Please re-login!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'index.html';
            } else {
                $scope.alertmsg = data['data']['error'];
                $("#alertmodal").modal('show');
                $scope.alertjump = "";
            }
        }
    }

    var errorFunction = function(data) {
        console.log("1deamaxwu ---> reponse ERROR: " + data['data']);
        $scope.alertmsg = "Error Connection! " + data['data'];
        $("#alertmodal").modal('show');
        $scope.alertjump = "";
    };
    
    $scope.logoutUser = function() {
        TopnGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }

	var topnSuccessFunction = function(data) {
        console.log("1deamxwu ---> get topn respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> get topn success.");
            console.log(data['data']['results']);
            $scope.pbrs = data['data']['results'][0]['pubs'];
            $scope.sbrs = data['data']['results'][0]['subs'];
            
        } else {
            console.log("1deamaxwu ---> get topn ERROR: " + data['data']['error']);
            if (data['data']['error'] == "Invalid access token") {
                $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'index.html';
            } else if (data['data']['error'] == "User is not authenticated") {
                $scope.alertmsg = "User is not authenticated! Please re-login!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'index.html';
            } else {
                $scope.alertmsg = data['data']['error'];
                $("#alertmodal").modal('show');
                $scope.alertjump = "";
            }
        }
    }
	
	$scope.timeSelect = function() {
            if ($scope.timesel == "24H") {
                console.log("1deamaxwu ---> 24h.");
            } else if ($scope.timesel == "History") {
                console.log("1deamaxwu ---> all.");
            } else {
                console.log("1deamaxwu ---> unrecognized TimeSelect option.");

            }
            $scope.fname = "topnTest5" + $scope.chlsel + $scope.timesel;
            GetTopn($scope.fname);
        }
	
	$scope.channelSelect = function() {
            if ($scope.chlsel == "EmergenciesOfType") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else if ($scope.chlsel == "EmergenciesOfTypeAtLocation") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else if ($scope.chlsel == "IptMsgofEmergenciesOfTypeIntUser") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else {
                console.log("1deamaxwu ---> unrecognized TimeSelect option.");

            }
            $scope.fname = "topnTest5" + $scope.chlsel + $scope.timesel;
            GetTopn($scope.fname);
        }
        
	GetTopn = function(fname){
		console.log("1deamaxwu ---> GetTopn.");
		//fname = $scope.fname;
		console.log("1deamaxwu ---> FName: " + fname);
		paras = ['llun'];
		TopnGetter.getTopn($scope.userId, $scope.accessToken, fname, paras, SessionStorage.get('brokerUrl'), topnSuccessFunction, errorFunction);
	}
	
    $scope.init = function() {
        SessionStorage.conf();
		$scope.timesel = "24H"
		$scope.chlsel = "EmergenciesOfType"
		$scope.fname = "topnTest5" + $scope.chlsel + $scope.timesel;
		
		$scope.pbrs = [];
		$scope.sbrs = [];
		
        $scope.alertmsg = "";
        $scope.alertjump = "";
		
        $scope.accessToken = SessionStorage.get('mgraccessToken');
        $scope.userId = SessionStorage.get('mgruserId');
        $scope.userName = SessionStorage.get('mgruserName');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('mgruserId'));
        
        GetTopn($scope.fname);
        
    }

}]);
