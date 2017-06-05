app.controller('IndexController', ['$scope', '$window', 'IndexGetter', function($scope, $window, 
    IndexGetter) { 
	//$scope.query='starbuck coffee';
	//$scope.topk='5';
	//$scope.dataset='teew';
	//$scope.opt='False';
	//$scope.divfree='False';
    var successFunction = function(data) {
		if(data['data']['status']=='success'){ 
			console.log("1deamaxwu ---> query results success");
			$scope.titletag='Query:'
			$scope.title=data['data']['query'];
			
			$scope.resultsliststag='Wise Crowd:'
			$scope.resultslists=data['data']['reslist'];
			
			$scope.resultsstatag='Running Statistics:'
			$scope.resultstitle=data['data']['title'];
			$scope.resultsstat=data['data']['stat'];			
		}else{
			console.log("1deamaxwu ---> query results ERROR")
			$window.alert(data['data']['error']);		
		}
        
    }

    var errorFunction = function(data) {
        console.log("1deamxwu ---> respond ERROR: " + data['data']);
		$window.alert(data['data']);
    }

    $scope.submitQuery = function(query,topk,dataset,opt,divfree) {
        IndexGetter.postQuery(query,topk,dataset,opt,divfree,
            successFunction, errorFunction);
    }
}]);
