(function(angular) {
    "use strict";
    angular.module("seams")
        .directive("seamsAddProduct", function($http, $location, seamsFileUploadService) {
            return {
                restrict: "E",
                templateUrl: "directives/seamsAddProduct-directive.html",
                scope: {
                    "products": "="
                },
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
                        if ($scope.newItem.image && $scope.newItem.name) {

                            $scope.newItem.id = $scope.newItem.name.replace(/[^\w\s]/gi, '');

                            var destination = '/img/products/';

                            seamsFileUploadService.upload($scope.newItem.image, destination).then(
                                function() {
                                    $scope.newItem.image = destination + $scope.newItem.image.name;
                                    $http.post("/api/dbCreate", $scope.newItem).then(
                                        function(result) {
                                            $scope.products.push(result.data);
                                        },
                                        function(error) {
                                            console.log("Error!")
                                        });
                                    $scope.showPanel = false;
                                },
                                function() {
                                    $scope.$emit("notAuthorized");
                                });
                        }
                    };
                }
            }
        })
}(angular))
