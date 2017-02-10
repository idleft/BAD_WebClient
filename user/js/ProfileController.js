app.controller('ProfileController', ['$scope', '$window', '$filter', 'ProfileGetter', 'SessionStorage', 
	function($scope, $window, $filter, ProfileGetter, SessionStorage) { 
		SessionStorage.conf();
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.userId = SessionStorage.get('userId');
		
		$scope.uname=SessionStorage.get('userName')
		$scope.uemail=$scope.uname+"@bad.com"
		$scope.ucity="Unknown"
		if($scope.uname == "Rose"){
			$scope.ucity="Riverside, CA"
		}else if($scope.uname == "Adam"){
			$scope.ucity="Austin, TX"
		}else if($scope.uname == "Walt"){
			$scope.ucity="Washington D.C."
		}else if($scope.uname == "Will"){
			$scope.ucity="Washington D.C."
		}else{
			console.log("1deamaxwu ---> city: "+$scope.uname)
		}
		console.log("1deamaxwu ---> profile: "+$scope.uname)
	var updateSuccessFunction = function (data) {
		
		}	
	var logoutSuccessFunction = function (data) {
            console.log("1deamxwu ---> logout respond success");
			if(data['data']['status']=='success'){
				console.log("1deamaxwu ---> logged out success as "+data['data']['userId']);
				SessionStorage.remove();
				$window.location.href = 'index.html';
			}else{
				console.log("1deamaxwu ---> logged out ERROR: "+data['data']['error'])
			}
        }
	var errorFunction = function(data) {
		console.log("1deamxwu ---> respond ERROR: " + data['data']);
		$window.alert(data['data']['error']);
	}
	
	$scope.updateUserInfo = function (name, email, bio) {
		ProfileGetter.updateUserInfo($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), name, email, bio, updateSuccessFunction, errorFunction);
		console.log("1deamaxwu ---> update user info as: "+name+" "+email+" "+bio)
    };
    
	$scope.logoutUser = function () {
		ProfileGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
        
    };

}]);
