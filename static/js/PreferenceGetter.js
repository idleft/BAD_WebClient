app.factory('PreferenceGetter', ['$http', function($http){
	return {
      postSubscription: function(userId, accessToken, parameters, successFunction, errorFunction){
        console.log("postSubscription");

        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'channelName' : 'nearbyTweetChannel',
          'parameters' : parameters
        };
        $http({
          url: '/subscribe',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      }
    };
  }]);