app.controller('OutputController', ['$scope', '$interval', '$window', '$filter', 'OutputGetter', 'SessionStorage', function($scope, $interval, $window, $filter, OutputGetter, SessionStorage) {
	
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
        OutputGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }

	var execSqlppSuccessFunction = function(data) {
        console.log("1deamxwu ---> exec sqlpp respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> get topn success.");
            console.log(data['data']['results']);
            $scope.datalists = data['data']['results'];
        } else {
            console.log("1deamaxwu ---> exec sqlpp ERROR: " + data['data']['error']);
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
            $scope.sqlpp = "select * from " + $scope.chlsel +" as record limit 10;";
            ExecSqlpp($scope.sqlpp);
        }
	
	$scope.channelSelect = function() {
            if ($scope.chlsel == "EmergencyReports") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else if ($scope.chlsel == "EmergencyShelters") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else if ($scope.chlsel == "UserLocations") {
                console.log("1deamaxwu ---> " + $scope.chlsel);
            } else {
                console.log("1deamaxwu ---> unrecognized TimeSelect option.");

            }
            $scope.sqlpp = "select * from " + $scope.chlsel +" as record limit 10;";
            ExecSqlpp($scope.sqlpp);
        }
    
    $scope.download = function() {
    	console.log("1deamaxwu ---> download: " + $scope.timesel + " for " + $scope.chlsel);
    	resource = "/mgr/res/data/data?f=" + Date.now();
    	window.open(resource);
    }    
	ExecSqlpp = function(sqlpp){
		console.log("1deamaxwu ---> ExecSqlpp.");
		console.log("1deamaxwu ---> sqlpp: " + sqlpp);
		OutputGetter.execSqlpp($scope.userId, $scope.accessToken, sqlpp, SessionStorage.get('brokerUrl'), execSqlppSuccessFunction, errorFunction);
	}
	
    $scope.init = function() {
        SessionStorage.conf();
		$scope.timesel = "History"
		$scope.chlsel = "EmergencyReports"
		$scope.sqlpp = "select * from " + $scope.chlsel +" as record limit 10;";
		$scope.datalists = [];
		
        $scope.alertmsg = "";
        $scope.alertjump = "";
		
        $scope.accessToken = SessionStorage.get('mgraccessToken');
        $scope.userId = SessionStorage.get('mgruserId');
        $scope.userName = SessionStorage.get('mgruserName');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('mgruserId'));
        
        ExecSqlpp($scope.sqlpp);
        
    }

}]);
