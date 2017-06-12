app.factory('FuncGetter',function(){
func1 = "create function recentEmergenciesOfType(emergencyType){ (with tenMinutesAgo as current_datetime() - day_time_duration(\"PT10S\") select report as reports from EmergencyReports report where report.timestamp >= tenMinutesAgo and report.emergencyType = emergencyType) }";


func2= "create function recentEmergenciesOfTypeAtLocation(emergencyType, lattitude, longitude){ (with tenMinutesAgo as current_datetime() - day_time_duration(\"PT10S\") select report as reports from EmergencyReports report where report.timestamp >= tenMinutesAgo and report.emergencyType = emergencyType and spatial_intersect(report.impactZone,create_circle(create_point(lattitude,longitude),0.01))) }";

func3= "create function recentEmergenciesOfTypeAtLocationWithShelter(emergencyType, lattitude, longitude){ (with tenMinutesAgo as current_datetime() - day_time_duration(\"PT10S\") select report as reports, shelter as shelters from EmergencyReports report let shelter = (select * from EmergencyShelters shelter where spatial_intersect(report.impactZone,create_circle(shelter.location,0.01))) where report.timestamp >= tenMinutesAgo and report.emergencyType = emergencyType and spatial_intersect(report.impactZone,create_circle(create_point(lattitude,longitude),0.01))) }";

func4= "create function recentEmergenciesOfTypeNearMe(emergencyType, uuid){ (with tenMinutesAgo as current_datetime() - day_time_duration(\"PT10S\") select report as reports from EmergencyReports report, UserLocations user where user.user_id = uuid and report.timestamp >= tenMinutesAgo and user.timestamp >= tenMinutesAgo and report.emergencyType = emergencyType and spatial_intersect(report.impactZone,create_circle(create_point(user.latitude,user.longitude),0.01))) //distinct by report.reportId }";

func5= "create function recentEmergenciesOfTypeWithShelterNearMe(emergencyType, uuid){ (with tenMinutesAgo as current_datetime() - day_time_duration(\"PT10S\") select report as reports, shelter as shelters from EmergencyReports report, UserLocations user let shelter = (select * from EmergencyShelters shelter where spatial_intersect(report.impactZone,create_circle(shelter.location,0.01))) where user.user_id = uuid and report.timestamp >= tenMinutesAgo and user.timestamp >= tenMinutesAgo and report.emergencyType = emergencyType and spatial_intersect(report.impactZone,create_circle(create_point(user.latitude,user.longitude),0.01))) //distinct by report.reportId }";

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
