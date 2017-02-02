## login ##
* user login
```
{ 
	"dataverseName": string,
	"userName" : string, 
	"password" : string, 
	"platform": string [possible values: "desktop", "web", "android"],
	"gcmRegistrationToken": string [for "android" platform]
} 
```
Response:
```
{ 
	"status": "success", 
	"userId" : string, 
	"accessToken": string 
} 
```
* Example call: http://<brokerIp>:8989/login
