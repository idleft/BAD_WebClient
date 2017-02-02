app.factory('AdminGetter', ['$http', function($http) {
    return {
        postUserData: function(userId, userPassword, url, successFunction, errorFunction) {
            console.log('1deamxwu ---> logging in as UserId: ' + userId + ' Pwd: ' + userPassword)
            var message = {
                'dataverseName': "channels",
                'userName': userId,
                'password': userPassword,
                'platform': 'web'
            };
            $http({
                url: 'http://' + url + '/login',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        }
    };
}]);
