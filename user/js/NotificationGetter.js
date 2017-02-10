app.factory('NotificationGetter', ['$http', function($http){
  return {
      pollBroker: function(successFunction, errorFunction){
        console.log("Hi");

        var message = {
          'userId' : 'abcd',
        };
        $http({
          url: '/events',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },

      getNewResults: function(userId, accessToken, subscriptionId, deliveryTime, channelName, url, 
        successFunction, errorFunction) {
        console.log('1deamxwu ---> getting newresults as UserId: '+userId+' SubId: '+subscriptionId)
        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'channelName' : channelName,
          'userSubscriptionId' : subscriptionId,
          'channelExecutionTime' : deliveryTime
        };

        $http({
          url: 'http://'+url+'/getresults',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },

	  ackResults: function(userId, accessToken, subscriptionId, deliveryTime, channelName, url, 
        successFunction, errorFunction) {
        console.log('1deamxwu ---> acking results as UserId: '+userId+' SubId: '+subscriptionId)
        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'channelName' : channelName,
          'userSubscriptionId' : subscriptionId,
          'channelExecutionTime' : deliveryTime
        };

        $http({
          url: 'http://'+url+'/ackresults',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },

      feedRecords: function(userId, accessToken, portNo, records, url, 
        successFunction, errorFunction) {
        console.log('1deamxwu ---> feeding records as UserId: '+userId+' records: '+records)
        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'portNo' : portNo,
          'records' : records
        };

        $http({
          url: 'http://'+url+'/feedrecords',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },

      getSubscriptions: function(userId, accessToken, url, successFunction, errorFunction) {
        console.log('1deamaxwu ---> getting subscriptions as UserId: '+userId);

        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken
        }

        $http({
          url: 'http://'+url+'/listsubscriptions',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },
		logout :function(userId, accessToken, url, successFunction, errorFunction){
			console.log('1deamaxwu ---> logging out as UserId: '+userId);

			var message = {
          		'dataverseName' : "channels",
          		'userId' : userId,
          		'accessToken' : accessToken
        	}
			$http({
          		url: 'http://'+url+'/logout',
          		method: "POST",
          		data: message,
        	}).then(successFunction, errorFunction);
		}
    };
}]);
