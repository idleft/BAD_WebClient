app.factory('DashBoardGetter', ['$http', function($http) {
    return {
    	postAdminQueryLS: function(appName, apiKey, query, channelName, url, successFunction, errorFunction) {
            console.log("1deamxwu ---> query LS application: ");
            var message = {
                'appName': appName,
                'apiKey': apiKey,
                'query': query,
                'channelName': channelName
            };
            $http({
                url: 'http://' + url + '/adminquery',
                method: 'POST',
                data: message,
            }).then(successFunction, errorFunction);
        },
        postAdminQueryLC: function(appName, apiKey, query, url, successFunction, errorFunction) {
            console.log("1deamxwu ---> query LC application: ");
            var message = {
                'appName': appName,
                'apiKey': apiKey,
                'query': query
            };
            $http({
                url: 'http://' + url + '/adminquery',
                method: 'POST',
                data: message,
            }).then(successFunction, errorFunction);
        },
        getKey: function(userId, accessToken, fname, paras, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> get apiKey as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'functionName': fname,
                'parameters': paras
            }
            $http({
                url: 'http://' + url + '/callfunction',
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
        }
    };
}]);
