app.controller('RegisterAppController',['$scope','$window','RegisterAppGetter','SessionStorage',function($scope,$window,RegisterAppGetter,SessionStorage){
	SessionStorage.conf();
	var successFunction = function(data) {
		console.log("1deamxwu ---> register application respond success");
		if(data['data']['status']=='success'){
			console.log('1deamxwu ---> register application Success as '+data['data']['appName']);
			$window.location.href = '/index.html';
		}else{
			console.log("1deamaxwu ---> register application ERROR: "+data['data']['error'])	
			$window.alert(data['data']['error']);	
		}

};
	var errorFunction = function(data) {
		console.log("1deamxwu ---> respond ERROR: " + data['data']);
		$window.alert(data['data']);
};
	$scope.registerUser = function(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL){
		RegisterAppGetter.postRegisterAppData(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL, SessionStorage.get('brokerUrl'), successFunction, errorFunction);
};

//tests

	$scope.updateApplication = function(){
		var appName="channels"
		var apiKey="adfq3453"
		var setupAQL=""
		RegisterAppGetter.postUpdateApplication(appName,apiKey,setupAQL,SessionStorage.get('brokerUrl'), successFunction, errorFunction);
};

	$scope.adminAppLogin = function(){
		var appName="channels"
		var adminUser="admin"
		var adminPassword="admin"
		RegisterAppGetter.postAdminAppLogin(appName,adminUser,adminPassword,SessionStorage.get('brokerUrl'), successFunction, errorFunction);
};

	$scope.adminQueryLC = function(){
		var appName="channels"
		var apiKey="asd35"
		var query="listchannels"
		RegisterAppGetter.postAdminQueryLC(appName,apiKey,query,SessionStorage.get('brokerUrl'), successFunction, errorFunction);
};

	$scope.adminQueryLS = function(){
		var appName="channels"
		var apiKey="guyruw"
		var query="listsubscriptions"
		var channelName="emergency"
		RegisterAppGetter.postAdminQueryLS(appName,apiKey,query,channelName,SessionStorage.get('brokerUrl'), successFunction, errorFunction);
};
//tests end

}]);
