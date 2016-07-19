/**
 * Created by purvi on 7/19/16.
 */
app.factory('SubscriptionGetter.js', ['http', function ($http) {
    return {
        postEmergenciesSubscription: function (userId, accessToken, parameters, successFunction, errorFunction) {
            console.log("postEmergenciesSubscription");
            for (var i = 0; i < parameters.length; i++) {

                var message = {
                    'dataverseName': "channels",
                    'userId': userId,
                    'accessToken': accessToken,
                    'channelName': 'recentEmergenciesOfTypeChannel',
                    'parameters': parameters[i]
                };
                $http({
                    url: '/subscribe',
                    method: "POST",
                    data: message
                }).then(successFunction, errorFunction);
            }
        },
        postEmergenciesNearMeSubscription: function (userId, userLocation, accessToken, parameters, successFunction, errorFunction) {

            console.log("postEmergenciesNearMeSubscription");
            for (var i = 0; i < parameters.length; i++) {

                var message;
                message = {
                    'dataverseName': "channels",
                    'userId': userId,
                    'accessToken': accessToken,
                    'channelName': 'recentEmergenciesOfTypeAtLocationChannel',
                    'parameters': [parameters [i], 'create-point(' + userLocation.x + ',' + userLocation.y + ')']
                };
                $http({
                    url: '/subscribe',
                    method: "POST",
                    data: message
                }).then(successFunction, errorFunction);
            }
        },
        postEmergenciesLoctionWithSheltersSubscription: function (userId, userLocation, accessToken, parameters, successFunction, errorFunction) {

            console.log("postEmergenciesLocationWithSheltersSubscription");
            for (var i = 0; i < parameters.length; i++) {

                var message;
                message = {
                    'dataverseName': "channels",
                    'userId': userId,
                    'accessToken': accessToken,
                    'channelName': 'recentEmergenciesOfTypeAtLocationWithShelter',
                    'parameters': [parameters [i], 'create-point(' + userLocation.x + ',' + userLocation.y + ')']
                };
                $http({
                    url: '/subscribe',
                    method: "POST",
                    data: message
                }).then(successFunction, errorFunction);
            }
        }


    };

}]);
