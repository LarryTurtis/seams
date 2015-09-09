(function(angular) {
    "use strict";
    angular.module("seams").service("seamsGetProducts", function($http) {


        var getProducts = function() {
            return $http.post("/api/db").then(function(result) {
                return result;
            });
        };

        return {
            getProducts: getProducts
        }
    });
}(angular));
