(function(angular) {
    "use strict";
    angular.module("seams")
        .directive("seamsDeleteProduct", function($http) {
            return {
                restrict: "E",
                templateUrl: "directives/seams-delete-product-directive.html",
                scope: {
                    "products": "="
                },
                link: function($scope) {

                    $scope.deleteItem = function() {

                        $http.post("/api/dbCreate", $scope.newItem).then(
                            function(result) {
                                $scope.products.push(result.data);
                                $scope.showPanel = false;
                            },
                            function(error) {
                                $scope.error = error.data;
                            });

                    }
                }
            };

        })
}(angular))
