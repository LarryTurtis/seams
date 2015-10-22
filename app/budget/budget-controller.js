(function(angular) {
'use strict';

    angular.module('seams')

    .controller("budgetCtrl", function($scope, $http) {

        $scope.isAdmin = false;

        $http.get('/api/getTransactions').then(function(result) {
            console.log(result)
            $scope.transactions = result.data;
            if (result.headers("Authorization")) {
                $scope.isAdmin = true;
            }
        });

    })

})(angular);
