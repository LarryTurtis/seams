(function(angular) {
    "use strict";
    angular.module("seams").service("seamsGetProducts", function($http) {


        var getProducts = function() {
            return $http.post("/api/db").then(function(result) {
                return result.data;
            });
        };

        return {
            getProducts: getProducts
        }
    });
}(angular));
