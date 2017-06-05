app.factory('OutputGetter', ['$http', function($http) {
    return {
    	getTopn: function(userId, accessToken, fname, paras, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> get topn as UserId: ' + userId);

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
