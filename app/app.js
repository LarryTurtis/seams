"use strict";

(function(angular) {

    angular.module("seams", ["ngRoute"])

    .config(["$routeProvider", function($routeProvider) {

        $routeProvider
            .when("/error", {
                templateUrl: "partials/error.html"
            })
            .when("/", {
                templateUrl: "partials/main.html"
            })
            .when("/spend", {
                templateUrl: "spend/spend.html",
                controller: "spendCtrl"
            })
            .when("/budget", {
                templateUrl: "budget/budget.html",
                controller: "budgetCtrl"
            })
            .otherwise({
                redirectTo: "/"
            })
    }])

    .controller("seamsCtrl", function($http, $scope, $location) {

        $scope.isAdmin = false;

        $http.get('/api/getBudget').then(function(result) {
            if (result.headers("Authorization")) {
                $scope.isAdmin = true;
            }
        });

        $scope.$on("notAuthorized", function() {
            $location.path("/error");
        });

        $scope.checkLocation = function(name) {
            return $location.path() === name;
        };

    })

    .filter("capitalize", function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

})(angular);
