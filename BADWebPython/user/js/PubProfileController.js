app.controller('PubProfileController', ['$scope', '$window', '$filter', 'PubProfileGetter', 'SessionStorage',
    function($scope, $window, $filter, PubProfileGetter, SessionStorage) {
        SessionStorage.conf();
        $scope.alertmsg = "";
        $scope.alertjump = "";
        $scope.accessToken = SessionStorage.get('pubaccessToken');
        $scope.userId = SessionStorage.get('pubuserId');

        $scope.uname = SessionStorage.get('pubuserName')
        $scope.uemail = $scope.uname + "@bad.com"
        $scope.ucity = "Unknown"
        if ($scope.uname == "Rose") {
            $scope.ucity = "Riverside, CA"
        } else if ($scope.uname == "Adam") {
            $scope.ucity = "Austin, TX"
        } else if ($scope.uname == "Walt") {
            $scope.ucity = "Washington D.C."
        } else if ($scope.uname == "Will") {
            $scope.ucity = "Washington D.C."
        } else {
            console.log("1deamaxwu ---> city: " + $scope.uname)
        }
        console.log("1deamaxwu ---> profile: " + $scope.uname)
        var updateSuccessFunction = function(data) {

        }

        $scope.closeAlert = function() {
            if ($scope.alertjump != "") {
                $window.location.href = $scope.alertjump;
            }
        }

        var logoutSuccessFunction = function(data) {
            console.log("1deamxwu ---> logout respond success");
            if (data['data']['status'] == 'success') {
                console.log("1deamaxwu ---> logged out success as " + data['data']['userId']);
                //SessionStorage.remove();
                SessionStorage.removeElement("pubaccessToken");
                SessionStorage.removeElement("pubuserId");
                SessionStorage.removeElement("pubuserName");
                $window.location.href = 'publish.html';
            } else {
                console.log("1deamaxwu ---> logged out ERROR: " + data['data']['error']);
                if (data['data']['error'] == "Invalid access token") {
                    //$window.alert("Invalid access token! Your account has been accessed at another device!");
                    $scope.alertmsg = "Invalid access token! Your account has been accessed at another device!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'publish.html';
                } else if (data['data']['error'] == "User is not authenticated") {
                    //$window.alert("User is not authenticated! Please re-login!");
                    $scope.alertmsg = "User is not authenticated! Please re-login!";
                    $("#alertmodal").modal('show');
                    $scope.alertjump = 'publish.html';
                } else {
                    //$window.alert(data['data']['error']);
                    $scope.alertmsg = data['data']['error'];
                    $("#alertmodal").modal('show');
                    $scope.alertjump = "";
                }
            }
        }
        var errorFunction = function(data) {
            console.log("1deamxwu ---> respond ERROR: " + data['data']);
            //$window.alert(data['data']);
            $scope.alertmsg = "Error Connection! " + data['data'];
            $("#alertmodal").modal('show');
            $scope.alertjump = "";
        }

        $scope.updateUserInfo = function(name, email, bio) {
            PubProfileGetter.updateUserInfo($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), name, email, bio, updateSuccessFunction, errorFunction);
            console.log("1deamaxwu ---> update user info as: " + name + " " + email + " " + bio)
        };

        $scope.logoutUser = function() {
            PubProfileGetter.logout($scope.userId, $scope.accessToken, SessionStorage.get('brokerUrl'), logoutSuccessFunction, errorFunction);

        };

    }
]);
