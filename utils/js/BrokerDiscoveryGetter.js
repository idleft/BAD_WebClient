app.factory('BrokerDiscoveryGetter', ['$window', '$http', function($window, $http) {
	
	function postGetBroker(url, successFunction, errorFunction){
		console.log("1deamxwu ---> postGetBroker.");
		var message = {
                'platform': 'web'
            };
            $http({
                url: 'http://' + url + '/getbroker',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
	}
	
	function getBrokerSuccessFunction(data){
		console.log("1deamxwu ---> get brokerurl respond success");
		if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> get brokerurl success as " + data['data']['brokerUrl']);
            $window.sessionStorage.setItem('brokerUrl', data['data']['brokerUrl']);
        } else {
            console.log("1deamaxwu ---> get brokerurl ERROR: " + data['data']['error'])
        }
	}
	
	function getBrokerErrorFunction(data){
		 console.log("1deamxwu ---> respond ERROR: " + data['data']);
		 //$scope.alertmsg = "Error Connection! " + data['data'];
		 $("#alertmodal p:first").text("Alert: Error Connection! " + data['data']);
		 $("#alertmodal").modal('show');
	}
		
	function getBroker(){
		console.log("1deamxwu ---> getBroker.");
		key = 'brokerUrl';
		if($window.sessionStorage.getItem(key) != null) {
			console.log("1deamxwu --->  Key is already present in local storage: " + key);
			$window.sessionStorage.removeItem(key);
			console.log("1deamxwu --->  Existing key is deleted");
			console.log("1deamxwu --->  getting a new brokerUrl");
			postGetBroker('128.195.4.50:5000', getBrokerSuccessFunction, getBrokerErrorFunction);
		}
		else {
			console.log("1deamxwu --->  Key is not present in local storage: " + key);
			console.log("1deamxwu --->  getting a new brokerUrl");
			postGetBroker('128.195.4.50:5000', getBrokerSuccessFunction, getBrokerErrorFunction);
		}		
	}
	
	return {
		getBroker : getBroker
	}
}]);
