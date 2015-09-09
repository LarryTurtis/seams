'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.
        when('/error', {
            templateUrl: 'partials/error.html'
        })
    }])

    .controller("seamsCtrl", function($scope, $location, seamsGetProducts) {

        $scope.products = seamsGetProducts.getProducts();

        $scope.$on("notAuthorized", function() {
            $location.path("/error");
        });

    })

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

})(angular);
