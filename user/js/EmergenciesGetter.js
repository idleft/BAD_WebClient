app.factory('EmergenciesGetter',function(){
var emergency=[
            {label: "Earthquake", val: false},
            {label: "Hurricane", val: false},
            {label: "Tornado", val: false},
            {label: "Flood", val: false},
            {label: "Shooting", val: false}
        ];
var subslist=["Earthquake NearMe","Shooting","Flood with Shelter"]
return {
	emergencytpye: emergency,
	subsrcibtionlist: subslist,
	}
	
});
