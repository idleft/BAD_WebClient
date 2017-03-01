/**
 * Created by purvi on 7/19/16.
 */
app.factory('UploadGetter', ['$http','$window',"$q",function ($http,$window,$q) {
    return {
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
		logout: function(userId, accessToken, url, successFunction, errorFunction){
			console.log('1deamaxwu ---> logging out as UserId: '+userId);

			var message = {
          		'dataverseName' : "channels",
          		'userId' : userId,
          		'accessToken' : accessToken
        	}
			$http({
          		url: 'http://'+url+'/logout',
          		method: "POST",
          		data: message,
        	}).then(successFunction, errorFunction);
		}
    };
}]);
