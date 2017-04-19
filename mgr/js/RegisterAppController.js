app.controller('RegisterAppController', ['$scope', '$window', 'RegisterAppGetter', 'SessionStorage', function($scope, $window, RegisterAppGetter, SessionStorage) {
    SessionStorage.conf();
    var successFunction = function(data) {
        console.log("1deamxwu ---> register application respond success");
        if (data['data']['status'] == 'success') {
            console.log('1deamxwu ---> register application Success as ' + data['data']['appName']);
            $window.alert("Register SUCCESS!");
            
            $scope.newAppName=null;
    		$scope.newAppDataverse=null;
    		$scope.newAdminUser=null;
    		$scope.newAdminPassword=null;
    		$scope.newEmail=null;
    		$scope.dropExisting=null;
    		$scope.newSetupAQL=null;
    	
            //$window.location.href = '/index.html';
        } else {
            console.log("1deamaxwu ---> register application ERROR: " + data['data']['error'])
            $window.alert(data['data']['error']);
        }

    };
    var errorFunction = function(data) {
        console.log("1deamxwu ---> respond ERROR: " + data['data']);
        $window.alert(data['data']);
    };
    $scope.registerUser = function(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL) {
    	
    	newAppName="emapp";
    	newAppDataverse="channels";
    	newAdminUser="appadmin"
    	newAdminPassword="appadmin"
    	newEmail="appadmin@bad.com"
    	dropExisting=true;
    	//newSetupAQL
    	
        RegisterAppGetter.postRegisterAppData(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
    };

	//populate DEMO data
	var loginsuccessFunction = function(data) {
        console.log("1deamxwu ---> login in user respond success");
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> logined user success as "+data['data']['userId']);
			dataaccessToken=data['data']['accessToken'];
        	datauserId=data['data']['userId'];
        	
        portNo=10002
		
		record="{\"name\": \"shelter-1\", \"location\":point(\"33.9459957, -117.4695675\"), \"reportId\":uuid(\"619e6050-289d-4105-b3b4-be075021613f\")}";
		RegisterAppGetter.feedRecords(datauserId, dataaccessToken, portNo, record, SessionStorage.get('brokerUrl'), shelterPopSuccessFunction, errorFunction);
		record="{\"name\": \"shelter-2\", \"location\":point(\"30.3076863, -97.8934839\"), \"reportId\":uuid(\"afb5fec2-1724-4b1a-b65b-39831dbe7035\")}";
		RegisterAppGetter.feedRecords(datauserId, dataaccessToken, portNo, record, SessionStorage.get('brokerUrl'), shelterPopSuccessFunction, errorFunction);
		record="{\"name\": \"shelter-3\", \"location\":point(\"38.8993277, -77.0846059\"), \"reportId\":uuid(\"c4de1063-5fe4-4764-8c26-9416f94984fa\")}";
		RegisterAppGetter.feedRecords(datauserId, dataaccessToken, portNo, record, SessionStorage.get('brokerUrl'), shelterPopSuccessFunction, errorFunction);
		record="{\"name\": \"shelter-4\", \"location\":point(\"41.5666487, -93.6765553\"), \"reportId\":uuid(\"a981b5a8-4b0e-454b-8ae8-52e4ad83af2e\")}";
		RegisterAppGetter.feedRecords(datauserId, dataaccessToken, portNo, record, SessionStorage.get('brokerUrl'), shelterPopSuccessFunction, errorFunction);
		record="{\"name\": \"shelter-5\", \"location\":point(\"46.0646914, -122.4503317\"), \"reportId\":uuid(\"4973cff5-e9dc-4af8-afd4-0f667aa0cd4a\")}";
		RegisterAppGetter.feedRecords(datauserId, dataaccessToken, portNo, record, SessionStorage.get('brokerUrl'), shelterPopSuccessFunction, errorFunction);
		
		$window.alert("Data Populated!");
		//$window.location.href = '/index.html';
		
		}else{
			console.log("1deamaxwu ---> login user ERROR: "+data['data']['error'])	
			$window.alert(data['data']['error']);	
		}
    }
	var registerUserSuccessFunction = function(data) {
        console.log("1deamxwu ---> register user respond success");
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> registered user success as "+data['data']['userId']);
		}else{
			console.log("1deamaxwu ---> register user ERROR: "+data['data']['error'])
			$window.alert(data['data']['error']);		
		}
        
    };
    var registerPubUserSuccessFunction = function(data) {
        console.log("1deamxwu ---> register user respond success");
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> registered user success as "+data['data']['userId']);
			RegisterAppGetter.postUserData("Loki", "clinton", SessionStorage.get('brokerUrl'), false, loginsuccessFunction, errorFunction);
		}else{
			console.log("1deamaxwu ---> register user ERROR: "+data['data']['error'])
			$window.alert(data['data']['error']);		
		}
        
    };
    var shelterPopSuccessFunction = function(data) {
        console.log("1deamxwu ---> feed shelter respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> feeded shelter success as " + data['data']);     
        } else {
            console.log("1deamaxwu ---> feed shelter ERROR: " + data['data']['error'])
        }
    };
	$scope.populateData = function(){
		console.log("1deamxwu ---> populate DEMO data.");
		//five subscriber users
		
		RegisterAppGetter.postRegisterUser("Rose", "trump", "rose@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		RegisterAppGetter.postRegisterUser("Adam", "trump", "adam@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		RegisterAppGetter.postRegisterUser("Walt", "trump", "walt@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		RegisterAppGetter.postRegisterUser("Will", "trump", "will@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		RegisterAppGetter.postRegisterUser("Mary", "trump", "mary@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		
		//one manager
		RegisterAppGetter.postRegisterUser("ProfX", "mgr", "profx@bad.com", SessionStorage.get('brokerUrl'), registerUserSuccessFunction, errorFunction);
		
		//one publisher user
		RegisterAppGetter.postRegisterUser("Loki", "clinton", "loki@bad.com", SessionStorage.get('brokerUrl'), registerPubUserSuccessFunction, errorFunction);
		//five shelters
		//shelters populate after Loki login
	
	};
	
    //tests

    $scope.updateApplication = function() {
        var appName = "channels"
        var apiKey = "adfq3453"
        var setupAQL = ""
        RegisterAppGetter.postUpdateApplication(appName, apiKey, setupAQL, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
    };

    $scope.adminAppLogin = function() {
        var appName = "channels"
        var adminUser = "admin"
        var adminPassword = "admin"
        RegisterAppGetter.postAdminAppLogin(appName, adminUser, adminPassword, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
    };

    $scope.adminQueryLC = function() {
        var appName = "channels"
        var apiKey = "asd35"
        var query = "listchannels"
        RegisterAppGetter.postAdminQueryLC(appName, apiKey, query, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
    };

    $scope.adminQueryLS = function() {
        var appName = "channels"
        var apiKey = "guyruw"
        var query = "listsubscriptions"
        var channelName = "emergency"
        RegisterAppGetter.postAdminQueryLS(appName, apiKey, query, channelName, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
    };
    //tests end

}]);
