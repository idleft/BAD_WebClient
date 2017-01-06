app.factory('PreferenceGetter', ['$http', function($http){
	return {
        getChannelList: function (userId, accessToken, url, successFunction, errorFunction) {
            console.log('1deamxwu ---> getting channellist as UserId: '+userId)
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            };
            $http({
                url: 'http://'+url+'/listchannels',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postSubscription: function (userId, accessToken, parameters, url, successFunction, errorFunction) {
            console.log('1deamxwu ---> posting subscription as UserId: '+userId+' Paras: '+parameters)
                var message = {
                    'dataverseName': "channels",
                    'userId': userId,
                    'accessToken': accessToken,
                    //'channelName': 'nearbyTweetChannel',
					'channelName': 'recentEmergenciesOfTypeChannel',
                    'parameters': parameters
                };
                $http({
                    url: 'http://'+url+'/subscribe',
                    method: "POST",
                    data: message
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
