app.controller('GameController', ['$scope', '$interval', '$window', '$filter', 'GameGetter', 'FuncGetter', 'SessionStorage', function($scope, $interval, $window, $filter, GameGetter, FuncGetter, SessionStorage) {
	
	function hasValue(arr, key, val) {
            if (arr == null) {
                return false;
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i][key] == val) {
                    return true;
                }
            }
            return false;
        }
    
    function compare(a,b) {
  if (a.times < b.times)
    return -1;
  if (a.times > b.times)
    return 1;
  return 0;
}
    $scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }

	GetGameStat = function() {
		console.log("1deamaxwu ---> GetGameStat.");
		GameGetter.getGameStat($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), gameSuccessFunction, errorFunction);
	}
	
	var gameSuccessFunction = function(data) {
		console.log("1deamxwu ---> get game statics success");
		if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> got game success status");
            //console.log("1deamaxwu ---> " + data['data']['gamestat'])
            $scope.pbrs = [];
			$scope.sbrs = [];
			$scope.batmsg = [];
            for (i = 0; i < data['data']['gamestat'].length; i++) {
            	console.log("1deamaxwu ---> " + data['data']['gamestat'][i]['userId'] + '@' + data['data']['gamestat'][i]['userType']);
            	if(data['data']['gamestat'][i]['userType'] == 'pbr'){
            		if(!$scope.pbrs.includes(data['data']['gamestat'][i]['userId'])){
            			$scope.pbrs.push(data['data']['gamestat'][i]['userId']);
            		}
            	}else if(data['data']['gamestat'][i]['userType'] == 'sbr'){
            		if(!$scope.sbrs.includes(data['data']['gamestat'][i]['userId'])){
            			sbr={};
            			sbr['name'] = data['data']['gamestat'][i]['userId'];
            			sbr['times'] = 0;
            			$scope.sbrs.push(sbr);
            		}
            	}else{
            		console.log("1deamaxwu ---> mgr")
            	}
            }
            $scope.batmsg = data['data']['batmsg'];
            
            for (i = 0; i < $scope.batmsg.length; i++){
            	for (j = 0; j < $scope.sbrs.length; j++){
            		if($scope.batmsg[i].includes($scope.sbrs[j]['name'])){
            			$scope.sbrs[j]['times'] = $scope.sbrs[j]['times'] + 1
            		}
            	}
            }
            console.log("1deamaxwu ---> BATMSG: " + $scope.batmsg)
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
	
	var signalSuccessFunction = function(data) {
        console.log("1deamxwu ---> signal respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> signal success.");
        } else {
            console.log("1deamaxwu ---> signal error: " + data['data']['error']);
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
    
	$scope.switchbtn = function(){
		if($scope.switch == true){
			//start interval stat
			console.log("1deamaxwu ---> START GAME!");
			
        	GetGameStat();
        	$scope.intid = $interval(function() {
        	    GetGameStat();
        	}, 3000);
        
		}else{
			//stop interval stat && clear broker stat && pop up winners
			console.log("1deamaxwu ---> STOP GAME!");
			$interval.cancel($scope.intid);
			$scope.winners = $scope.sbrs;
			$scope.winners.sort(compare);
			//console.log($scope.sbrs);
			//console.log($scope.winners)
			$("#honor").modal('show');
			
			signal = false;
			GameGetter.signalGame($scope.userId, $scope.accessToken, signal, SessionStorage.get('brokerUrl'), signalSuccessFunction, errorFunction);
		}
	}
    $scope.logoutUser = function() {
        GameGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }

    $scope.init = function() {
        SessionStorage.conf();
		
		$scope.pbrs = [];
		$scope.sbrs = [];
		$scope.batmsg = [];
		$scope.switch = false;
		$scope.winners = [];
		
        $scope.alertmsg = "";
        $scope.alertjump = "";
		
        $scope.accessToken = SessionStorage.get('mgraccessToken');
        $scope.userId = SessionStorage.get('mgruserId');
        $scope.userName = SessionStorage.get('mgruserName');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('mgruserId'));
        
    }

}]);
