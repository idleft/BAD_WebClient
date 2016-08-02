var http = require('http');
var url = require('url');
var request = require('request');

var sendTheRequest = function(urlString, requestFields){
	console.log(requestFields);
	request({
		uri: urlString,
		method: "POST",
		timeout: 10000,
	  	followRedirect: true,
	  	maxRedirects: 100,
	  	json: true,
		headers: {
			'content-type': 'application/json'
		},
		body: requestFields
	}, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			console.log("Registration worked!");
			console.log(body);
		}
	});

}

console.log("Hi");
sendTheRequest("http://radon.ics.uci.edu:5000/registerbroker", {"brokerName" : "brokerA", "brokerIP" : "128.195.52.73"});
