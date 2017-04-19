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
		postRegisterUser: function(newUserName, newUserPassword, newUserEmail, url, successFunction, errorFunction) {
		console.log('1deamxwu ---> registering as Name: '+newUserName+' Pwd: '+newUserPassword+' Email: '+newUserEmail)
        var message = {
          'dataverseName' : "channels",
          'userName' : newUserName,
          'password' : newUserPassword,
          'email'    : newUserEmail,
          'platform' : 'web'
        };
        $http({
          url: 'http://'+url+'/register',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },
      feedRecords: function(userId, accessToken, portNo, records, url, 
        successFunction, errorFunction) {
        console.log('1deamxwu ---> feeding records as UserId: '+userId+' records: '+records)
        var message = {
          'dataverseName' : "channels",
          'userId' : userId,
          'accessToken' : accessToken,
          'portNo' : portNo,
          'records' : records
        };

        $http({
          url: 'http://'+url+'/feedrecords',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },
      postUserData: function(userId, userPassword, url, stay, successFunction, errorFunction){
		console.log('1deamxwu ---> logging in as UserId: '+userId+' Pwd: '+userPassword)
        var message = {
          'dataverseName' : "channels",
          'userName' : userId,
          'userType': 'pbr',
          'password' : userPassword,
          'platform' : 'web',
          'stay': stay
        };
        $http({
			url: 'http://'+url+'/login',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      },


    };
}]);
