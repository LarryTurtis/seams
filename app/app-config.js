(function(angular) {
    "use strict";

    angular.module("seams")

    .config(['ChartJsProvider', function(ChartJsProvider) {
        // Configure all charts
        ChartJsProvider.setOptions('Bar', {
            colours: ['#5BC0DF', '#d9534f']
        });

    }]);

})(angular);
