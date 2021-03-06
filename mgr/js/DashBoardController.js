app.controller('DashBoardController', ['$scope', '$window', '$filter', 'DashBoardGetter', 'FuncGetter', 'SessionStorage', function($scope, $window, $filter, DashBoardGetter, FuncGetter, SessionStorage) {

    function setValue(id, val) {
        for (var i = 0; i < $scope.channels.length; i++) {
            if ($scope.channels[i].name == id) {
                $scope.channels[i].sublist = val;
            }
        }
    }

    $scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }

    var lsSuccessFunction = function(data) {
        console.log("1deamxwu ---> LS respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> LS success as " + data['data']);
            if (data['data']['subscriptions'] != null) {
                //console.log(data['data']['subscriptions']);
                sublist = [];
                channelName = "";
                for (i = 0; i < data['data']['subscriptions'].length; i++) {
                    items = data['data']['subscriptions'][i]['userId'].split('@')
                    sublist.push(items[0]);
                    channelName = data['data']['subscriptions'][i]['channelName'];
                }
                uniquesub = sublist.filter(function(item, pos) {
                    return sublist.indexOf(item) == pos;
                })
                setValue(channelName, uniquesub);
            }

        } else {
            console.log("1deamaxwu ---> LS ERROR: " + data['data']['error']);
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

    var lcSuccessFunction = function(data) {
        console.log("1deamxwu ---> LC respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> LC success as " + data['data']);
            if (data['data']['channels'] != null) {
                console.log(data['data']['channels']);
                for (var i = 0; i < data['data']['channels'].length; i++) {
                    channel = {
                        'no': i + 1,
                        'name': data['data']['channels'][i]['ChannelName'],
                        'dataverseName': data['data']['channels'][i]['DataverseName'],
                        'duration': data['data']['channels'][i]['Duration'],
                        'function': data['data']['channels'][i]['Function'],
                        'resultsDatasetName': data['data']['channels'][i]['ResultsDatasetName'],
                        'subscriptionDatasetName': data['data']['channels'][i]['SubscriptionDatasetName'],
                        'func': $filter('filter')($scope.funcs, {chname: data['data']['channels'][i]['ChannelName']})[0]['func'],
                        'sublist': []
                    }
                    //list subscription
                    var query = "listsubscriptions"
                    DashBoardGetter.postAdminQueryLS($scope.appName, $scope.apiKey, query, data['data']['channels'][i]['ChannelName'], SessionStorage.get('brokerUrl'), lsSuccessFunction, errorFunction);

                    $scope.channels.push(channel);
                }
            }

        } else {
            console.log("1deamaxwu ---> LC ERROR: " + data['data']['error']);
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
	
	var getKeySuccessFunction = function(data) {
        console.log("1deamxwu ---> get apikey respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> get apikey success.");
            //console.log(data['data']['results']);
            $scope.apiKey = data['data']['results'][0]['apiKey'];
            
            ListChannels();
        } else {
            console.log("1deamaxwu ---> get apikey ERROR: " + data['data']['error']);
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

    ListChannels = function() {
        var query = "listchannels"
        DashBoardGetter.postAdminQueryLC($scope.appName, $scope.apiKey, query, SessionStorage.get('brokerUrl'), lcSuccessFunction, errorFunction);
    }

    $scope.logoutUser = function() {
        DashBoardGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }
    
    GetKey = function(){
    	fname = 'getApiKey';
    	paras = [$scope.appName];
    	DashBoardGetter.getKey($scope.userId, $scope.accessToken, fname, paras, SessionStorage.get('brokerUrl'), getKeySuccessFunction, errorFunction);
    }

    $scope.init = function() {
        SessionStorage.conf();

        $scope.appName = 'emapp'
        //$scope.apiKey = "2fdefc0ee5f8f7160e7b62a7f57ce28bea1445058fda5982f5ee3fb2"
		
        $scope.channels = [];

        $scope.alertmsg = "";
        $scope.alertjump = "";
        
        $scope.funcs = FuncGetter.funclist;
		
		//console.log("1deamaxwu ---> Funcs: " + $scope.funcs);
		
        $scope.accessToken = SessionStorage.get('mgraccessToken');
        $scope.userId = SessionStorage.get('mgruserId');
        $scope.userName = SessionStorage.get('mgruserName');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('mgruserId'));
		
		GetKey();
    }

}]);
