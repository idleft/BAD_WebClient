app.controller('UploadCtrl', ['$scope', '$window', '$filter', 'SessionStorage', 'UploadGetter', 'geolocationService', 'EmergenciesGetter', function($scope, $window, $filter, SessionStorage, UploadGetter, geolocationService, EmergenciesGetter) {

    $scope.map = {
        center: {
            latitude: 39.7642548,
            longitude: -104.9951939
        },
        zoom: 9,
        events: {
            click: function(mapModel, eventName, args) {
                console.log("1deamaxwu ---> marker click: " + args[0].latLng.lng());
                if ($scope.locselection == "onmap") {
                    cmlat = args[0].latLng.lat();
                    cmlng = args[0].latLng.lng();

                    $scope.marker.coords.latitude = cmlat;
                    $scope.marker.coords.longitude = cmlng;
                    $scope.$apply();
                } else {
                    console.log("1deamaxwu ---> only marker click.");
                }
            }
        }
    };
    
    $scope.control = {};
	
	//loki @Denver
    $scope.marker = {
        id: 0,
        coords: {
            latitude: 39.764254,
            longitude: -104.9951939
        },
        options: {
            draggable: false,
            icon: 'res/loki.png',
            visible: true
        },
        events: {
            dragend: function(marker, eventName, args) {
                var lat = marker.getPosition().lat();
                var lon = marker.getPosition().lng();
                console.log("1deamaxwu ---> marker dragend: " + lat + ',' + lon);

                $scope.marker.options = {
                    draggable: true,
                    icon: 'res/loki.png',
                    labelContent: "(" + $scope.marker.coords.latitude.toFixed(6) + ', ' + $scope.marker.coords.longitude.toFixed(6) + ')',
                    labelAnchor: "100 0",
                    labelClass: "marker-labels"
                };
            }
        }
    };

    $scope.closeAlert = function() {
        if ($scope.alertjump != "") {
            $window.location.href = $scope.alertjump;
        }
    }

    $scope.typeChange = function() {
        console.log("1deamaxwu ---> TYPE: " + $scope.typeselection);
    }

    $scope.locChange = function() {
        console.log("1deamaxwu ---> LOC: " + $scope.locselection);
        if ($scope.locselection == "onmap") {
            $scope.marker.options.draggable = true;
        } else {
            $scope.marker.options.draggable = false;
            if ("seattle" == $scope.locselection) {
                mlat = 47.6147628;
                mlng = -122.4759875;
            } else if ("desmoines" == $scope.locselection) {
                mlat = 41.5666487;
                mlng = -93.6765553;
            } else if ("washington" == $scope.locselection) {
                mlat = 38.8993277;
                mlng = -77.0846059;
            } else if ("riverside" == $scope.locselection) {
                mlat = 33.9459957;
                mlng = -117.4695675;
            } else if ("austin" == $scope.locselection) {
                mlat = 30.3076863;
                mlng = -97.8934839;
            } else {
                console.log("1deamaxwu ---> unknown city!")
            }

            $scope.marker.coords.latitude = mlat;
            $scope.marker.coords.longitude = mlng;

            $scope.map.center.latitude = mlat;
            $scope.map.center.longitude = mlng;
        }

    }

    //get formatted date
    function getFDate() {
        date = new Date();
        year = date.getUTCFullYear();
        month = date.getUTCMonth() + 1;
        day = date.getUTCDate();
        hour = date.getUTCHours();
        minute = date.getUTCMinutes();
        second = date.getUTCSeconds();

        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        if (hour < 10) {
            hour = '0' + hour
        }
        if (minute < 10) {
            minute = '0' + minute
        }
        if (second < 10) {
            second = '0' + second
        }

        return year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':' + second + 'Z';
    }
    //UUID
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    $scope.publishBtn = function() {
        if ($scope.typeselection == "" || $scope.locselection == "") {
            $scope.alertmsg = "Please Select a TYPE a LOC!";
            $("#alertmodal").modal('show');
            $scope.alertjump = "";
        } else {
            console.log("1deamaxwu ---> TYPE and LOC: " + $scope.typeselection + " and " + $scope.locselection)

            var portNo = 10001;

            var offset = 100 + Math.random() * 10;
            var dur = 500 + Math.random() * 10;
            var sever = Math.floor((Math.random() * 10) + 1);

            var baselat = 33.64295
            var baselng = -117.841377

            if ("seattle" == $scope.locselection) {
                baselat = 46.0646914;
                baselng = -122.4503317;
            } else if ("desmoines" == $scope.locselection) {
                baselat = 41.5666487;
                baselng = -93.6765553;
            } else if ("washington" == $scope.locselection) {
                baselat = 38.8993277;
                baselng = -77.0846059;
            } else if ("riverside" == $scope.locselection) {
                baselat = 33.9459957;
                baselng = -117.4695675;
            } else if ("austin" == $scope.locselection) {
                baselat = 30.3076863;
                baselng = -97.8934839;
            } else {
                console.log("1deamaxwu ---> unknown city!")
            }

            var lat = baselat + Math.random() * 0.2;
            var lng = baselng + Math.random() * 0.2;

            if ($scope.locselection == "onmap") {
                console.log("1deamaxwu ---> You are dragging....");
                lat = $scope.marker.coords.latitude;
                lng = $scope.marker.coords.longitude;
            }

            //0.2 < radius < 1
            var rad = (0.2 + Math.random() * 0.8) * 0.5;
            var time = getFDate();

            $scope.desc = "{\"message\": \"" + $scope.typeselection + " alert!\", \"duration\": " + dur.toFixed(4) + "s, \"severity\": " + sever + ", \"impactZone\": circle(\"" + lat.toFixed(4) + ", " + lng.toFixed(4) + " " + Math.round(rad.toFixed(4) * 100000) + "m\"), \"timestamp\": \"" + time + "\"}";

            var record = "{\"emergencyType\":\"" + $scope.typeselection + "\",\"message\":\"" + $scope.typeselection + " alert!\",\"timeoffset\":" + offset + ",\"duration\":" + dur + ",\"severity\":" + sever + ",\"impactZone\":circle(\"" + lat + "," + lng + " " + rad + "\"),\"timestamp\":datetime(\"" + time + "\"),\"reportId\":uuid(\"" + guid() + "\")}";
            UploadGetter.feedRecords($scope.userId, $scope.accessToken, portNo, record, SessionStorage.get('brokerUrl'), uploadSuccessFunction, errorFunction);

        }
    }

    var uploadSuccessFunction = function(data) {
        console.log("1deamxwu ---> feed record respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> feeded record success as " + data['data']);

            report = {
                type: $scope.typeselection,
                city: $scope.locselection,
                desc: $scope.desc,
            };
            $scope.reports.reverse();
            $scope.reports.push(report);
            $scope.reports.reverse();


        } else {
            console.log("1deamaxwu ---> feed record ERROR: " + data['data']['error']);
            if (data['data']['error'] == "Invalid access token") {
                $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'publish.html';
            } else if (data['data']['error'] == "User is not authenticated") {
                $scope.alertmsg = "User is not authenticated! Please re-login!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'publish.html';
            } else {
                $scope.alertmsg = data['data']['error'];
                $("#alertmodal").modal('show');
                $scope.alertjump = "";
            }
        }
    }

    var logoutSuccessFunction = function(data) {
        console.log("1deamxwu ---> logout respond success");
        if (data['data']['status'] == 'success') {
            console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
            SessionStorage.removeElement("pubaccessToken");
            SessionStorage.removeElement("pubuserId");
            SessionStorage.removeElement("pubuserName");
            $window.location.href = 'publish.html';
        } else {
            console.log("1deamaxwu ---> logged out ERROR: " + data['data']['error']);
            if (data['data']['error'] == "Invalid access token") {
                $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'publish.html';
            } else if (data['data']['error'] == "User is not authenticated") {
                $scope.alertmsg = "User is not authenticated! Please re-login!";
                $("#alertmodal").modal('show');
                $scope.alertjump = 'publish.html';
            } else {
                $scope.alertmsg = data['data']['error'];
                $("#alertmodal").modal('show');
                $scope.alertjump = "";
            }
        }
    }

    var errorFunction = function(data) {
        console.log("1deamaxwu ---> reponse ERROR: " + data['data']);
        $scope.alertmsg = "Error Connection! " + data['data'];
        $("#alertmodal").modal('show');
        $scope.alertjump = "";
    };

    $scope.logoutUser = function() {
        UploadGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);
    }

    $scope.init = function() {
        SessionStorage.conf();
        
        $scope.alertmsg = "";
        $scope.alertjump = "";
        
        $scope.reports = [];
        $scope.desc = "";
        
        $scope.accessToken = SessionStorage.get('pubaccessToken');
        $scope.userId = SessionStorage.get('pubuserId');
        console.log("1deamaxwu ---> accessToken: " + $scope.accessToken + " userId: " + SessionStorage.get('pubuserId'));

        $scope.types = EmergenciesGetter.typelist;
        $scope.typeselection = "";
        $scope.locs = EmergenciesGetter.loclist;
        $scope.locselection = "";
    }

}]);
