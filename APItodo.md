# general operations for a user

## listallproducts ##
* list all the products that BAD services provide
```
{ 
	"dataverseName": string
} 
```
Response:
```
{ 
	"status": "success", 
	"products" : [{"procustId": string},{"productType": string}] 
} 
```
* Example call: http://<brokerIp>:8989/listallproducts

## listregisteredproducts ##
* list all the products that a user has registered
```
{ 
	"dataverseName": string,
	"userId" : string,
	"accessToken": string
} 
```
Response:
```
{ 
	"status": "success", 
	"products" : [{"procustId": string},{"productType": string}] 
} 
```
* Example call: http://<brokerIp>:8989/listregisteredproducts

## registerproduct ##
* register a product by a user
```
{ registerApplication -- create a new app with 
	"dataverseName": string,
	"userId" : string,
	"accessToken": string
} 
```
Response:
```
{ 
	"status": "success", 
} 
```
* Example call: http://<brokerIp>:8989/registerproduct

## deleteproduct ##
* delete (unregister) a product by a user
```
{ 
	"dataverseName": string,
	"userId" : string,
	"accessToken": string
} 
```
Response:
```
{ 
	"status": "success", 
} 
```
* Example call: http://<brokerIp>:8989/deleteproduct

# for root user

## listapplications ##
* list all applications under management with information
```
{ 
	"dataverseName": string,
	"userId" : string,
	"accessToken": string
} 
```
Response:
```
{ 
	"status": "success", 
	"applications" : [{"applicationId": string},{"applicationInfo":{"applicationName": string,"numberOfUsers": int,...}}] 
} 
```
* Example call: http://<brokerIp>:8989/listapplications

# for manager user

# for end user

