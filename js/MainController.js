app.controller('MainController', ['$scope', 'HttpGetter', function($scope, HttpGetter) { 
	$scope.reddit = new HttpGetter();
}]);