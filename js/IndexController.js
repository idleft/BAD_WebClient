app.controller('IndexController', ['$scope', 'HttpGetter', function($scope, HttpGetter) { 
	$scope.reddit = new HttpGetter();
}]);