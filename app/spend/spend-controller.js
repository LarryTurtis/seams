(function(angular) {
    'use strict';

    angular.module('spend')
        .controller("spendCtrl", spendCtrl);

    spendCtrl.$inject = ["seamsAuthService", "SpendService"];

    function spendCtrl(seamsAuthService, SpendService) {

        var vm = this;

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        vm.startDate = new Date(year, month, 1);
        vm.endDate = new Date(year, month, day);
        vm.isAdmin = false;
        vm.updateTransaction = updateTransaction;
        vm.addVendor = addVendor;
        vm.updateVendor = updateVendor;
        vm.categoryClick = categoryClick;
        vm.activate = activate;
        vm.amortizeBudget = true;
        vm.showlineChart = true;

        activate();

        function activate() {
            SpendService.get({
                    startDate: vm.startDate,
                    endDate: vm.endDate
                }, vm.amortizeBudget)
                .then(function(result) {
                    vm.spend = result;
                    vm.isAdmin = seamsAuthService.getAuth();
                });

            vm.showlineChart = (new Date(vm.startDate)).getDate() === 1 &&
                (new Date(vm.startDate)).getMonth() === (new Date(vm.endDate)).getMonth();
        }

        function updateTransaction(transaction) {
            SpendService.updateTransaction(transaction)
                .then(function(result) {
                    vm.spend = result;
                });
        }

        function updateVendor(transaction) {
            SpendService.updateVendor(transaction)
                .then(function(result) {
                    vm.spend = result;
                });
        }

        function addVendor(transaction) {
            SpendService.addVendor(transaction)
                .then(function(result) {
                    vm.spend = result;
                });
        }

        function errorCb(error) {
            vm.error = error.data;
        }

        function categoryClick(category) {
            category.show = !category.show;
            angular.forEach(vm.categories, function(cat) {
                if (cat !== category) cat.show = false;
            });
        }

    }

})(angular);
