(function(angular) {
    "use strict";

    angular.module("spend")
        .factory("TransactionResource", TransactionResource);

    TransactionResource.$inject = ["$resource"];

    function TransactionResource($resource) {
        return $resource("/api/transactions/", null, {
            get: {
                method: "GET",
                isArray: true
            },
            update: {
                method: "PUT",
            },
            updateAll: {
                method: "PUT",
                url: "/api/updateAllTransactions/",
            },
            deleteAll: {
                method: "PUT",
                url: "/api/deleteAllTransactions",
            }
        });
    }
})(angular);
