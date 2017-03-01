app.factory('IndexGetter', ['$http', function($http) {
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
        },
        postRegisterUser: function(newUserName, newUserPassword, newUserEmail, url, successFunction, errorFunction) {
            console.log('1deamxwu ---> registering as Name: ' + newUserName + ' Pwd: ' + newUserPassword + ' Email: ' + newUserEmail)
            var message = {
                'dataverseName': "channels",
                'userName': newUserName,
                'password': newUserPassword,
                'email': newUserEmail,
                'platform': 'web'
            };
            $http({
                url: 'http://' + url + '/register',
                method: "POST",
                data: message,
            }).then(successFunction, errorFunction);
        }
    };
}]);
