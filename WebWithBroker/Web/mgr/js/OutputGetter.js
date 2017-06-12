app.factory('OutputGetter', ['$http', function($http) {
    return {
    	execSqlpp: function(userId, accessToken, sqlpp, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> get sqlpp as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'sqlpp': sqlpp
            }
            $http({
                url: 'http://' + url + '/execsqlpp',
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
