'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope, $http) {
        
        $http.get("sampleData.json").then(function(result){
            $scope.products = result.data;
        });

    });

})(angular);
