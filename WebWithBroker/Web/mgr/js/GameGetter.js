app.factory('GameGetter', ['$http', function($http) {
    return {
    	getGameStat: function(userId, accessToken, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> get game as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            }
            $http({
                url: 'http://' + url + '/getgamestat',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        },
        signalGame: function(userId, accessToken, signal, url, successFunction, errorFunction) {
            console.log('1deamaxwu ---> signal game as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken,
                'signal': signal
            }
            $http({
                url: 'http://' + url + '/signalgame',
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
