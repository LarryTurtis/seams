'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope, $http) {
        
        $http.post("/api/db").then(function(result){
            $scope.products = result.data;
        });

    })

    .directive("addProduct", function($http) {
        return {
            restrict: "E",
            templateUrl: "/directives/seamsAddProduct-directive.html",
            link: function($scope) {
                $scope.fields = [{"name": "Image", "type": "file"},
                                {"name": "Name", "type": "text"},
                                {"name": "Description", "type": "text"},
                                {"name": "Price", "type": "number"},
                                {"name": "Size", "type": "text"},
                                ];
                $scope.newItem = {};

                $scope.addItem = function() {
                    $http.post("/api/dbCreate", $scope.newItem);
                };
            }
        }
    })

})(angular);
