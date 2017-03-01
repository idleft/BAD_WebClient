app.factory('EmergenciesGetter',function(){
var emergency=[
            {label: "Earthquake", val: false},
            {label: "Hurricane", val: false},
            {label: "Tornado", val: false},
            {label: "Flood", val: false},
            {label: "Shooting", val: false},
            {label: "Riot", val: false}
        ];
var subslist=["Earthquake NearMe","Shooting","Flood with Shelter"];
var locs=[{name: "Seattle", val: "seattle"},{name: "Des Moines", val: "desmoines"},{name: "D.C.", val: "washington"},{name: "Austin", val: "austin"},{name: "Riverside", val: "riverside"},{name: "Munich", val: "munich"}];

var types=[{name: "Earthquake", val: "earthquake"},{name: "Hurricane", val: "hurricane"},{name: "Tornado", val: "tornado"},{name: "Flood", val: "flood"},{name: "Shooting", val: "shooting"}, {name: "Riot", val: "riot"}];

return {
	emergencytpye: emergency,
	subsrcibtionlist: subslist,
	loclist: locs,
	typelist: types,
	}
	
});
