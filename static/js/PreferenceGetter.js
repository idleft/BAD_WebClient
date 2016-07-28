app.factory('PreferenceGetter', ['$http', function($http){
	return {
        getChannelList: function (userId, accessToken, successFunction, errorFunction) {
            console.log("getChannelList");
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            };
            $http({
                url: 'http://127.0.0.1:8989/listchannels',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postSubscription: function (userId, accessToken, parameters, successFunction, errorFunction) {
            console.log("postSubscription");
                var message = {
                    'dataverseName': "channels",
                    'userId': userId,
                    'accessToken': accessToken,
                    'channelName': 'nearbyTweetChannel',
                    'parameters': parameters
                };
                $http({
                    url: 'http://127.0.0.1:8989/subscribe',
                    method: "POST",
                    data: message
                }).then(successFunction, errorFunction);
            
        }
   
    };
  }]);
