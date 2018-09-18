app.factory('EmergenciesGetter',function(){
var emergency=[
            {label: "Earthquake", val: false},
            {label: "Hurricane", val: false},
            {label: "Tornado", val: false},
            {label: "Flood", val: false},
            {label: "Shooting", val: false},
            {label: "Riot", val: false}
        ];
var locs=[{name: "Irvine", val: "irvine"},{name: "Seattle", val: "seattle"},{name: "Des Moines", val: "desmoines"},{name: "D.C.", val: "washington"},{name: "Austin", val: "austin"},{name: "Riverside", val: "riverside"},{name: "Munich", val: "munich"}];

var types=[{name: "Earthquake", val: "earthquake"},{name: "Hurricane", val: "hurricane"},{name: "Tornado", val: "tornado"},{name: "Flood", val: "flood"},{name: "Shooting", val: "shooting"}, {name: "Riot", val: "riot"}];

var citylocs=[{name:"irvine", loc:{lat:33.6424092,lng:-117.8410603}},
    {name:"seattle", loc:{lat:47.6205063,lng:-122.3492774}},
    {name:"desmoines", loc:{lat:41.5912022,lng:-93.6036389}},
    {name:"washington", loc:{lat:38.8976763,lng:-77.0365298}},
    {name:"riverside", loc:{lat:33.9576324,lng:-117.3963211}},
    {name:"austin", loc:{lat:30.2746652,lng:-97.7403505}},
    {name:"munich", loc:{lat:48.138631,lng:11.5736254}}];

var colors={"earthquake": "#5D5B5B", "hurricane": "#DAF7A6", "tornado": "#FFC300", "flood": "#FF5733", "shooting": "#C70039", "riot": "#2ECC71"}

return {
	emergencytpye: emergency,
	loclist: locs,
	typelist: types,
	citylist: citylocs,
	colorlist: colors,
	}
	
});
