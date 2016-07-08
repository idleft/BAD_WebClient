app.controller('MainController', ['$scope', '$interval', '$websocket', 'HttpGetter', 'SessionStorage', 
	function($scope, $interval, $websocket, HttpGetter, SessionStorage) {

	$scope.parseMessage = function(message) {
		console.log('Received websocket message from the server');
		var data = JSON.parse(message.data);
		console.log(data);
	}

	$scope.init = function() {
		$scope.userId = SessionStorage.get('userId');
		$scope.accessToken = SessionStorage.get('accessToken');
		$scope.subscriptionId = SessionStorage.get('subscriptionId');
		$scope.latestTimeStamp = SessionStorage.get('timestamp');

		console.log('SAFIR-->Creating Web Socket');
		$scope.dataStream = $websocket('ws://127.0.0.1:8989/websocketlistener');
		$scope.dataStream.onMessage($scope.parseMessage);
	}

}]);