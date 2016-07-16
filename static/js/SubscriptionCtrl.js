app.controller('SubscriptionCtrl',['$scope','geolocationService',function($scope,geolocationService){

	console.log("In SubscriptionCtrl");

	geolocationService.getCurrentPosition().then(UserPosition);

	function UserPosition(position)
	{
		console.log("in UserPosition");
		var lat = position.coords.latitude;
		var lng = position.coords.longitude;
		$scope.mylocation={latitude:lat,longitude:lng};
		console.log("latitude"+lat);
	}

}]);