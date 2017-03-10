app.controller('DashBoardController', ['$scope', '$window', 'DashBoardGetter', 'SessionStorage', function($scope, $window, DashBoardGetter, SessionStorage) {
	
	$scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }
    var lsSuccessFunction = function(data) {
        console.log("1deamxwu ---> LC respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> LC success as " + data['data']);
            if (data['data']['channels'] != null) {
            	console.log(data['data']['channels']);
                for (var i = 0; i < data['data']['channels'].length; i++) {
                	channel= {
                		'no': i+1,
                		'name': data['data']['channels'][i]['ChannelName'],
                		'dataverseName': data['data']['channels'][i]['DataverseName'],
                		'duration': data['data']['channels'][i]['Duration'],
                		'function': data['data']['channels'][i]['Function'],
                		'resultsDatasetName': data['data']['channels'][i]['ResultsDatasetName'],
                		'subscriptionDatasetName': data['data']['channels'][i]['SubscriptionDatasetName']
                	}
                	
                	$scope.channels.push(channel);
                }
            }
            
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
    
    ListChannels = function(){
    	var appName = "emapp"
        var apiKey = "e1f9875ae4986a2b33e84854433699c4869828191cf905ed1a0323a3"
        var query = "listchannels"
        DashBoardGetter.postAdminQueryLC(appName, apiKey, query, SessionStorage.get('brokerUrl'), lsSuccessFunction, errorFunction);
    }
    
    $scope.logoutUser = function() {
        DashBoardGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }
    
    $scope.init = function() {
        SessionStorage.conf();
		
		$scope.channels = [];
		
        $scope.alertmsg = "";
        $scope.alertjump = "";

        $scope.accessToken = SessionStorage.get('mgraccessToken');
        $scope.userId = SessionStorage.get('mgruserId');
        $scope.userName = SessionStorage.get('mgruserName');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('pubuserId'));
        
        ListChannels();
   }

}]);
