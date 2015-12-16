(function(angular) {
    "use strict";

    angular.module("spend")
        .factory("BudgetResource", BudgetResource);

    BudgetResource.$inject = ["$resource"];

    function BudgetResource($resource) {
        return $resource("/api/budget/", null, {
            get: {
                method: "GET",
                isArray: true
            },
            update: {
                method: "PUT",
                isArray: true
            }
        });
    }
})(angular);
