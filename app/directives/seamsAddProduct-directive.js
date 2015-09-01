(function(angular) {
    "use strict";
    angular.module("seams")
        .directive("seamsAddProduct", function($http, seamsFileUploadService) {
            return {
                restrict: "E",
                templateUrl: "app/directives/seamsAddProduct-directive.html",
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
                        if ($scope.newItem.image) {
                            seamsFileUploadService.upload($scope.newItem.image).then(function() {
                                $scope.newItem.image = $scope.newItem.image.name;
                                $http.post("/api/dbCreate", $scope.newItem);
                                $scope.showPanel = false;
                            });
                        }
                    };
                }
            }
        })
}(angular))
