'use strict';

(function(angular) {

    angular.module('seams', ['ngRoute', 'AngularStore'])

    .config(['$routeProvider', function($routeProvider) {

        $routeProvider
            .when('/error', {
                templateUrl: 'partials/error.html'
            })
            .when('/shop', {
                templateUrl: "partials/shop.html"
            })
            .when('/', {
                templateUrl: "partials/main.html"
            })
            .otherwise({
                redirectTo: "/"
            })
    }])

    .controller("seamsCtrl", function($scope, $location, seamsGetProducts) {

        $scope.isAdmin = false;

        seamsGetProducts.getProducts().then(function(result) {
            $scope.products = result.data;
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

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

})(angular);
