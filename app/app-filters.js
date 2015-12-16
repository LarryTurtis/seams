(function(angular) {
    'use strict';
    angular.module("seams")
        .filter("capitalize", function() {
            return function(input, scope) {
                if (input != null)
                    input = input.toLowerCase();
                return input.substring(0, 1).toUpperCase() + input.substring(1);
            }
        })
        .filter('unique', function() {
            return function(arr, field) {
                return _.uniq(arr, function(a) {
                    return a[field];
                });
            };
        });

})(angular);
