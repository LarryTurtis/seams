(function(angular) {
    'use strict';

    angular.module('spend')
        .factory("Transaction", TransactionProvider);

    TransactionProvider.$inject = ["TransactionResource"];

    function TransactionProvider(TransactionResource) {

        /**
         * @constructs
         */
        function Transaction() {}

        Transaction.create = create;

        return Transaction;

        function create(dates) {
            var transactions = new Transaction();

            return TransactionResource.get({
                    startDate: dates.startDate,
                    endDate: dates.endDate
                }).$promise
        }


    }

})(angular);
