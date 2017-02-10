/**
 * Created by purvi on 7/19/16.
 */
app.factory('SubscriptionGetter', ['$http','$window',"$q",function ($http,$window,$q) {
    return {
        postEmergenciesSubscription: function (userId, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting EmergenciesSubscription for "+ parameters);
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeChannel',
                'parameters': [parameters]
            };
            $http({
                url: 'http://'+url+'/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesAtLocationSubscription: function (userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting EmergenciesNearMeSubscription for "+ [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeAtLocationChannel',
                'parameters': [parameters, userLocation.latitude, userLocation.longitude]
            };
            $http({
                url: 'http://'+url+'/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesLocationWithShelterSubscription: function (userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting EmergenciesLocationWithSheltersSubscription for " + [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeAtLocationWithShelterChannel',
                'parameters': [parameters, userLocation.latitude, userLocation.longitude]
            };
            $http({
                url: 'http://'+url+'/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postIptMsgofEmergenciesOfTypeIntUserSubscription: function (userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting IptMsgofEmergenciesOfTypeIntUserSubscription for "+ [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentIptMsgofEmergenciesOfTypeIntUserChannel',
                'parameters': [parameters, userId]
            };
            $http({
                url: 'http://'+url+'/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postIptMsgofEmergenciesOfTypeWithShelterIntUserSubscription: function (userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting IptMsgofEmergenciesOfTypeWithShelterIntUserSubscription for " + [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentIptMsgofEmergenciesOfTypeWithShelterIntUserChannel',
                'parameters': [parameters, userId]
            };
            $http({
                url: 'http://'+url+'/subscribe',
                method: "POST",
                data: message
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
