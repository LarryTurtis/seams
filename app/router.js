(function(angular) {
    "use strict";

    angular.module("seams")

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
                controller: "spendCtrl",
                controllerAs: "vm"
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
})(angular);
