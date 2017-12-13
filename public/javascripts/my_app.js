String.prototype.format = function() {
    a = this;
    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k])
    }
    return a
};

var app = angular.module("myApp", []);

/* This is the controller for the auth stuff from lab 6. */
app.controller('myController', ['$scope', '$http',
    function($scope, $http) {

    $http.get('/user/profile')
        .success(function(data, status, headers, config) {
            $scope.user = data;
            $scope.error = "";
        })
        .error(function(data, status, headers, config) {
            $scope.user = {};
            $scope.error = data;
        });
    function removeFromContacts(contact) {
        console.log("Attempting to delete {} from User contacts.".format(contact.name));

    }

    /* Function to send an SMS message using API built by Dan Kindt. */
    $scope.sendSMS = function(contact) {
        var alertmsg = "{0}";
        var name = contact.name;
        var phoneNumber = contact.phone_number;
        console.log("Attempting to send SMS to " + name);
        $http({
            url: "https://www.searchit.today/send-sms",
            method: "POST",
            data: {
                "fName":    name,
                "pNum":     phoneNumber
            },
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            transformRequest: function (obj) {
                var str = [];
                for(var p in obj) {
                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                };
                return str.join("&");
            }

        }).then(function successCallback(response) {
            var data = response.data;
            var msg = alertmsg.format(data.msg);
            console.log("SMS sent response: " + data);
            $scope.alertType = "alert alert-info alert-dismissable fade in";
            $scope.alertMSG = msg;

        }, function errorCallback(response) {
            console.log("failed! statusText: " + response.statusText);
            var msg = "Unable to send SMS.  Status Text: {0}";
            $scope.alertType = "alert alert-danger alert-dismissable fade in";
            $scope.alertMSG = msg.format(response.statusText);
        });
    };

}]); // end of myController
