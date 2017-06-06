app.factory('FuncGetter',function(){
func1 = "create function recentEmergenciesOfType($emergencyType){ for $report in dataset EmergencyReports let $tenMinutesAgo := current-datetime() - day-time-duration(\"PT10S\") where $report.timestamp >= $tenMinutesAgo and $report.emergencyType = $emergencyType return { \"reports\":$report}}";


func2= "create function recentEmergenciesOfTypeAtLocation($emergencyType, $lattitude, $longitude){ for $report in dataset EmergencyReports let $tenMinutesAgo := current-datetime() - day-time-duration(\"PT10S\") where $report.timestamp >= $tenMinutesAgo	and $report.emergencyType = $emergencyType and spatial-intersect($report.impactZone,create-circle(create-point($lattitude,$longitude),0.01)) return { \"reports\":$report}}";

func3= "create function recentEmergenciesOfTypeAtLocationWithShelter($emergencyType, $lattitude, $longitude){ for $report in dataset EmergencyReports let $shelters := for $shelter in dataset EmergencyShelters where spatial-intersect($report.impactZone,create-circle($shelter.location,0.01)) return $shelter let $tenMinutesAgo := current-datetime() - day-time-duration(\"PT10S\") where $report.timestamp >= $tenMinutesAgo and $report.emergencyType = $emergencyType and spatial-intersect($report.impactZone,create-circle(create-point($lattitude,$longitude),0.01)) return { \"reports\":$report, \"shelters\":$shelters, \"reportsiz\":$report.impactZone}}";

func4= "create function recentIptMsgofEmergenciesOfTypeIntUser($emergencyType, $uuid){ for $report in dataset EmergencyReports for $user in dataset UserLocations let $tenMinutesAgo := current-datetime() - day-time-duration(\"PT10S\") where $user.user-id = $uuid and $report.timestamp >= $tenMinutesAgo and $user.timestamp >= $tenMinutesAgo and $report.emergencyType = $emergencyType and spatial-intersect($report.impactZone,create-point($user.latitude,$user.longitude)) return {\"reports\":$report}}";

func5= "create function recentIptMsgofEmergenciesOfTypeWithShelterIntUser($emergencyType, $uuid){ for $report in dataset EmergencyReports for $user in dataset UserLocations let $shelters := for $shelter in dataset EmergencyShelters where spatial-intersect($report.impactZone,create-circle($shelter.location,0.01)) return $shelter let $tenMinutesAgo := current-datetime() - day-time-duration(\"PT10S\")	where $user.user-id = $uuid and $report.timestamp >= $tenMinutesAgo and $user.timestamp >= $tenMinutesAgo and $report.emergencyType = $emergencyType and spatial-intersect($report.impactZone,create-point($user.latitude,$user.longitude)) return {\"reports\":$report, \"shelters\":$shelters}}";

var funcs=[
            {chname: "recentEmergenciesOfTypeChannel", func: func1},
            {chname: "recentEmergenciesOfTypeAtLocationChannel", func: func2},
            {chname: "recentEmergenciesOfTypeAtLocationWithShelterChannel", func: func3},
            {chname: "recentEmergenciesOfTypeNearMeChannel", func: func4},
            {chname: "recentEmergenciesOfTypeWithShelterNearMeChannel", func: func5}
        ];

return {
	funclist: funcs,
	}
	
});
