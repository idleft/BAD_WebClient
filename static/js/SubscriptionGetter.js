/**
 * Created by purvi on 7/19/16.
 */
app.factory('SubscriptionGetter', ['$http','$window',"$q",function ($http,$window,$q) {
    return {
        postEmergenciesSubscription: function (userId, accessToken, parameters, successFunction, errorFunction) {
            console.log("postEmergenciesSubscription");
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeChannel',
                'parameters': [parameters]
            };
            $http({
                url: '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesAtLocationSubscription: function (userId, userLocation, accessToken, parameters, successFunction, errorFunction) {
            console.log("postEmergenciesNearMeSubscription");
            console.log("Subscribing for :" + parameters);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeAtLocationChannel',
                'parameters': [parameters, userLocation.latitude, userLocation.longitude]
            };
            $http({
                url: '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesLocationWithSheltersSubscription: function (userId, userLocation, accessToken, parameters, successFunction, errorFunction) {
            console.log("postEmergenciesLocationWithSheltersSubscription");
            console.log("Subscribing for :" + parameters);

            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeAtLocationWithShelter',
                'parameters': [parameters, userLocation.latitude, userLocation.longitude]
            };
            $http({
                url: '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        }
    };
}]);
