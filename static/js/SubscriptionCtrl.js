app.controller('SubscriptionCtrl',['$scope','geolocationService','SessionStorage',function($scope,geolocationService,SessionStorage){

	console.log("In SubscriptionCtrl");

	$scope.mylocation = geolocationService.getCurrentLocation();
	console.log("latitude:"+$scope.mylocation.chords.latitude);
	console.log("longitude:"+$scope.mylocation.chords.longitude);

}]);