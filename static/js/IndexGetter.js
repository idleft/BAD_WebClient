app.factory('IndexGetter', ['$http', function($http){
	return {
      postUserData: function(userId, userPassword, successFunction, errorFunction){
        console.log("Hi");

        var message = {
          'dataverseName' : "channels",
          'userName' : userId,
          'password' : userPassword
        };
        $http({
          url: 'http://127.0.0.1:8989/login',
          method: "POST",
          data: message,
        }).then(successFunction, errorFunction);
      }
    };
  }]);