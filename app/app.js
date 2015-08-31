'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope, $http) {

        $http.post("/api/db").then(function(result) {
            $scope.products = result.data;
        });

    })

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    })

    .directive("addProduct", function($http) {
        return {
            restrict: "E",
            templateUrl: "/directives/seamsAddProduct-directive.html",
            link: function($scope) {
                $scope.fields = [{
                    "name": "image",
                    "type": "file"
                }, {
                    "name": "name",
                    "type": "text"
                }, {
                    "name": "description",
                    "type": "text"
                }, {
                    "name": "price",
                    "type": "number"
                }, {
                    "name": "size",
                    "type": "text"
                }, ];
                $scope.newItem = {};

                $scope.addItem = function() {
                    console.log($scope.newItem, $scope.newItem.image)

                    $http.post("/api/dbCreate", $scope.newItem);
                };
            }
        }
    })

})(angular);
