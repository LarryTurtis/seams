(function(angular) {
    'use strict';

    angular.module('spend')
        .factory("Budget", BudgetProvider);

    BudgetProvider.$inject = ["BudgetResource"];

    function BudgetProvider(BudgetResource) {

        /**
         * @constructs
         */
        function Budget() {}

        Budget.create = create;

        return Budget;

        function create(dates) {
            var budget = new Budget();

            return BudgetResource.get().$promise
        }


    }

})(angular);
