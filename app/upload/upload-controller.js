(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("uploadCtrl", function($scope, $http, seamsAuthService) {

        $scope.isAdmin = seamsAuthService.getAuth();
        $scope.deleteAllTransactions = function() {
            $http.post("/api/deleteAllTransactions")
                .then(function() {
                    $scope.message = "Complete."
                    $timeout(function() {
                        $scope.message = "";
                    }, 2000)
                });
        }

    });
})(angular);
