app.factory('HttpGetter', ['$http', function($http){
  return {
      pollBroker: function(successFunction, errorFunction){
        console.log("Hi");

        var message = {
          'userId' : 'abcd',
        };
        $http({
          url: 'http://127.0.0.1:8989/events',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },
      getNewResults: function(userId, accessToken, subscriptionId, deliveryTime, channelName, 
        successFunction, errorFunction) {
        console.log('In Get new results');

        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'channelName' : channelName,
          'userSubscriptionId' : subscriptionId,
          'deliveryTime' : deliveryTime
        };

        $http({
          url: 'http://127.0.0.1:8989/getresults',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      }
    };
}]);