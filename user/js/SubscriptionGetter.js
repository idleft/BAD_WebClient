/**
 * Created by purvi on 7/19/16.
 */
app.factory('SubscriptionGetter', ['$http', '$window', "$q", function($http, $window, $q) {
    return {
        postEmergenciesSubscription: function(userId, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting EmergenciesSubscription for " + parameters);
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeChannel',
                'parameters': [parameters]
            };
            $http({
                url: 'http://' + url + '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesAtLocationSubscription: function(userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting EmergenciesNearMeSubscription for " + [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentEmergenciesOfTypeAtLocationChannel',
                'parameters': [parameters, userLocation.latitude, userLocation.longitude]
            };
            $http({
                url: 'http://' + url + '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postEmergenciesLocationWithShelterSubscription: function(userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
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
                url: 'http://' + url + '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postIptMsgofEmergenciesOfTypeIntUserSubscription: function(userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
            console.log("1deamaxwu ---> posting IptMsgofEmergenciesOfTypeIntUserSubscription for " + [parameters, userLocation.latitude, userLocation.longitude]);
            var message;
            message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': 'recentIptMsgofEmergenciesOfTypeIntUserChannel',
                'parameters': [parameters, userId]
            };
            $http({
                url: 'http://' + url + '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        postIptMsgofEmergenciesOfTypeWithShelterIntUserSubscription: function(userId, userLocation, accessToken, parameters, url, successFunction, errorFunction) {
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
                url: 'http://' + url + '/subscribe',
                method: "POST",
                data: message
            }).then(successFunction, errorFunction);
        },
        battleReport: function(userId, accessToken, batmsg, url, 
            successFunction, errorFunction) {
            console.log('1deamxwu ---> report battle as UserId: ' + userId)
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'batmsg': batmsg
            };

            $http({
                url: 'http://' + url + '/battlereport',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        getSubscriptions: function(userId, accessToken, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> getting subscriptions as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            }

            $http({
                url: 'http://' + url + '/listsubscriptions',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        getSubscriptions: function(userId, accessToken, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> getting subscriptions as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            }

            $http({
                url: 'http://' + url + '/listsubscriptions',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        logout: function(userId, accessToken, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> logging out as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            }
            $http({
                url: 'http://' + url + '/logout',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        deleteSub: function(userId, accessToken, userSubscriptionId, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> delete sub  as subId: ' + userSubscriptionId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'userSubscriptionId': userSubscriptionId
            }
            $http({
                url: 'http://' + url + '/unsubscribe',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        getNewResults: function(userId, accessToken, subscriptionId, deliveryTime, channelName, url,
            successFunction, errorFunction) {
            console.log('1deamxwu ---> getting newresults as UserId: ' + userId + ' SubId: ' + subscriptionId)
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': channelName,
                'userSubscriptionId': subscriptionId,
                'channelExecutionTime': deliveryTime
            };

            $http({
                url: 'http://' + url + '/getresults',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        ackResults: function(userId, accessToken, subscriptionId, deliveryTime, channelName, url,
            successFunction, errorFunction) {
            console.log('1deamxwu ---> acking results as UserId: ' + userId + ' SubId: ' + subscriptionId)
            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'channelName': channelName,
                'userSubscriptionId': subscriptionId,
                'channelExecutionTime': deliveryTime
            };

            $http({
                url: 'http://' + url + '/ackresults',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },


    };
}]);
