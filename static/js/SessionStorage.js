app.factory('SessionStorage', function($window) {
	function set(key, data) {
		$window.sessionStorage.setItem(key, data)
		console.log($window.sessionStorage.getItem(key));
	}
	function get(key) {
		return $window.sessionStorage.getItem(key);
	}

	return {
		set: set,
		get: get
	}

});