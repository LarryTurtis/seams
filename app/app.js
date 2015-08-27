'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope, $http) {
        
        $http.post("/api/db").then(function(result){
            $scope.products = result.data;
        });

    });

})(angular);
