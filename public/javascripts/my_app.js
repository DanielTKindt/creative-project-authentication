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
    $scope.contacts = [];

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
}]); // end of myController
