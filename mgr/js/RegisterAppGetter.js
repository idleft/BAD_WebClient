app.factory('RegisterAppGetter', ['$http', function($http) {
    return {
        postRegisterAppData: function(newAppName, newAppDataverse, newAdminUser, newAdminPassword, newEmail, dropExisting, newSetupAQL, url, successFunction, errorFunction) {
            console.log("1deamxwu ---> registering application: " + newAppName + '\t' + newAppDataverse + '\t' + newAdminUser + '\t' + newAdminPassword + '\t' + newEmail + '\t' + dropExisting + '\t' + newSetupAQL);
            var message = {
                'appName': newAppName,
                'appDataverse': newAppDataverse,
                'adminUser': newAdminUser,
                'adminPassword': newAdminPassword,
                'email': newEmail,
                'dropExisting': dropExisting,
                'setupAQL': newSetupAQL

            };
            $http({
                url: 'http://' + url + '/registerapplication',
                method: 'POST',
                data: message,
            }).then(successFunction, errorFunction);
        },

        postUpdateApplication: function(appName, apiKey, setupAQL, url, successFunction, errorFunction) {
            console.log("1deamxwu ---> update application: ");
            var message = {
                'appName': appName,
                'apiKey': apiKey,
                'setupAQL': setupAQL

            };
            $http({
                url: 'http://' + url + '/updateapplication',
                method: 'POST',
                data: message,
            }).then(successFunction, errorFunction);
        },

        postAdminAppLogin: function(appName, adminUser, adminPassword, url, successFunction, errorFunction) {
            console.log("1deamxwu ---> admin login application: ");
            var message = {
                'appName': appName,
                'adminUser': adminUser,
                'adminPassword': adminPassword

            };
            $http({
                url: 'http://' + url + '/appadminlogin',
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



    };
}]);
