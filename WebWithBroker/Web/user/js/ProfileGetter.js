app.factory('ProfileGetter', ['$http', function($http) {
    return {
        updateUserInfo: function(userId, accessToken, url, name, email, bio, successFunction, errorFunction) {
            console.log('1deamaxwu ---> update user info as UserId: ' + userId);

            var message = {
                'dataverseName': "channels",
                'userId': userId,
                'accessToken': accessToken
            }

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
