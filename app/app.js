'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope, seamsGetProducts) {

        $scope.products = seamsGetProducts.getProducts();

    })

    .filter('capitalize', function() {
        return function(input, scope) {
            if (input != null)
                input = input.toLowerCase();
            return input.substring(0, 1).toUpperCase() + input.substring(1);
        }
    });

})(angular);
