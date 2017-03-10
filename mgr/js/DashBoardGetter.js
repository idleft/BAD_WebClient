app.factory('DashBoardGetter', ['$http', function($http) {
    return {
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
