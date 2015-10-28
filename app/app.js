"use strict";

(function(angular) {

    angular.module("seams", ["ngRoute"])

    .config(["$routeProvider", function($routeProvider) {

        $routeProvider
            .when("/error", {
                templateUrl: "partials/error.html"
            })
            .when("/", {
                redirectTo: "spend"
            })
            .when("/spend", {
                templateUrl: "spend/spend.html",
                controller: "spendCtrl"
            })
            .when("/upload", {
                templateUrl: "upload/upload.html",
                controller: "uploadCtrl"
            })
            .when("/budget", {
                templateUrl: "budget/budget.html",
                controller: "budgetCtrl"
            })
            .otherwise({
                redirectTo: "spend"
            })
    }])

    .controller("seamsCtrl", function($http, $scope, $location, seamsAuthService) {

        $scope.isAdmin = seamsAuthService.getAuth();

        $scope.checkLocation = function(name) {
            return $location.path() === name;
        };

        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) === path) {
                return 'active';
            } else {
                return '';
            }
        }

    })

    .filter("capitalize", function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

})(angular);
