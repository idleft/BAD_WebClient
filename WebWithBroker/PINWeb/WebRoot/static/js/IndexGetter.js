app.factory('IndexGetter', ['$http', function($http){
	return {
      postQuery: function(query,topk,dataset,opt,divfree, successFunction, errorFunction) {
		console.log('1deamxwu ---> querying as: '+query)
		url='radon.ics.uci.edu:9110'
        var message = {
          'query' : query,
          'topk' : topk,
          'dataset' : dataset,
          'opt'    : opt,
          'divfree' : divfree
        };
        $http({
          url: 'http://'+url+'/submit',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      }
    };
  }]);
