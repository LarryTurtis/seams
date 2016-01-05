(function(angular) {
    'use strict';

    angular.module('spend')
        .factory("SpendService", SpendService);

    SpendService.$inject = ["$q", "Transaction", "TransactionResource", "Budget", "seamsAuthService", "VendorResource"];

    function SpendService($q, Transaction, TransactionResource, Budget, seamsAuthService, VendorResource) {

        var selectedDates;
        var amortized;

        return {
            get: get,
            updateVendor: updateVendor,
            addVendor: addVendor,
            updateTransaction: updateTransaction
        }

        function get(dates, amortize) {
            selectedDates = dates || selectedDates;
            amortized = amortize;
            var transactions = Transaction.create(selectedDates)
            var budget = Budget.create();

            return $q.all([transactions, budget])
                .then(parseResults)
        }

        function updateVendor(transaction) {
            var vendor = {
                name: transaction.description,
                category: transaction.newCategory
            }
            return VendorResource.update(vendor)
                .$promise
                .then(function() {
                    return updateAllTransactionsForVendor(transaction)
                });
        }

        function addVendor(transaction) {
            var vendor = {
                name: transaction.description,
                category: transaction.newCategory
            }
            return VendorResource.create(vendor)
                .$promise
                .then(function() {
                    return updateAllTransactionsForVendor(transaction)
                });
        }

        function updateTransaction(transaction) {
            var data = {
                reference: transaction.reference,
                description: transaction.description,
                account: transaction.account,
                category: transaction.newCategory
            }
            return TransactionResource.update(data)
                .$promise
                .then(function() {
                    return get(null, amortized);
                });
        }

        function updateAllTransactionsForVendor(transaction) {
            var data = {
                description: transaction.description,
                category: transaction.newCategory
            }
            return TransactionResource.updateAll(data)
                .$promise
                .then(function() {
                    return get(null, amortized);
                });
        }

        function parseResults(data) {

            seamsAuthService.setAuth(true);

            var transactions = data[0];
            var budget = data[1];
            var updated = {};
            var categories = [];
            var categoryAmount = {};
            var totalAmount = 0;
            var totalBudget = 0;

            _.remove(transactions, function(n) {

                //find the last modified transaction for each account.
                updated[n.account] = new Date(n.modified) > updated[n.account] ? n.modified : updated[n.account]

                //find any $0 transactions and any transactions in the Transfer category.
                if (n.amount >= 0 || n.category === 'Transfer') {
                    return true;
                } else {
                    totalAmount += n.amount;
                    if (categoryAmount[n.category] <= 0) {
                        categoryAmount[n.category] += n.amount
                    } else {
                        categoryAmount[n.category] = n.amount;
                    }
                    return false;
                }
            });
            var numberOfDays = (selectedDates.endDate - selectedDates.startDate) / 1000 / 60 / 60 / 24
            angular.forEach(budget, function(item) {
                item.amount = amortized ? (item.amount * 12) / 365 * numberOfDays : item.amount;
                categories.push({
                    name: item.category,
                    budget: item.amount,
                    transactions: [],
                    amount: categoryAmount[item.category] || 0,
                    diff: item.amount + categoryAmount[item.category]
                });
                totalBudget += item.amount;

            })

            return {
                transactions: transactions,
                categories: categories,
                totalAmount: totalAmount,
                totalBudget: totalBudget,
                updated: updated,
                barChart: barChart(budget, categories),
                donutChart: donutChart(budget, categories),
                lineChart: lineChart(transactions)
            }
        }

        function barChart(budget, categories) {
            return {
                series: ["Budget", "Spend"],
                labels: _.pluck(_.sortBy(budget, 'category'), 'category'),
                data: [_.map(_.pluck(_.sortBy(budget, 'category'), 'amount'), function(n) {
                    return Math.round(n, 2)
                }), _.map(_.pluck(_.sortBy(categories, 'name'), 'amount'), function(n) {
                    return -Math.round(n, 2);
                })]
            };
        }

        function donutChart(budget, categories) {
            return {
                labels: _.pluck(_.sortBy(budget, 'category'), 'category'),
                data: _.map(_.pluck(_.sortBy(categories, 'name'), 'amount'), function(n) {
                    return -Math.round(n, 2);
                })
            }
        }

        function lineChart(transactions) {
            var labels = [];
            for (var i = 1; i <= (new Date(selectedDates.endDate)).getDate(); i++) {
                labels.push(i);
            }
            var data = [new Array(labels.length)];
            _.fill(data[0], 0);
            angular.forEach(transactions, function(transaction) {
                var index = (new Date(transaction.date)).getDate();
                data[0][index - 1] += -Math.round(transaction.amount, 2);
            });
            return {
                series: ["Spend"],
                labels: labels,
                data: data
            };
        }

    }

})(angular);
