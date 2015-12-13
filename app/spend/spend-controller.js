(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("spendCtrl", function($scope, $http, seamsAuthService, $filter) {

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth();
        var day = date.getDate();
        $scope.startDate = new Date(year, month, 1);
        $scope.endDate = new Date(year, month, day);
        $scope.isAdmin = false;
        $scope.categories = [];
        $scope.updateTransaction = updateTransaction;
        $scope.addAdvertiser = addAdvertiser;
        $scope.updateAdvertiser = updateAdvertiser;
        $scope.totalAmount = 0;
        $scope.totalBudget = 0;
        $scope.update = update;
        $scope.amortizeBudget = true;
        $scope.updated = {
            amex: new Date(2001, 1, 1),
            ally: new Date(2001, 1, 1),
            cp1: new Date(2001, 1, 1)
        }
        $scope.barseries = ["Budget", "Spend"];
        $scope.lineseries = ["Spend"];
        $scope.showlineChart = true;
        $scope.categoryClick = categoryClick;

        update();

        function update() {
            $scope.transactions = [];
            $scope.categories = [];
            $scope.totalAmount = 0;
            $scope.totalBudget = 0;
            $scope.isAdmin = seamsAuthService.getAuth();

            $http.get('/api/getTransactions?startDate=' + $scope.startDate + '&endDate=' + $scope.endDate)
                .then(function(result) {
                    $scope.transactions = result.data;
                    seamsAuthService.setAuth(true);
                    $scope.isAdmin = seamsAuthService.getAuth();

                    _.remove($scope.transactions, function(n) {
                        checkDate(n)
                        return n.amount > 0 || n.category === 'Transfer';
                    });

                    $scope.totalAmount = _.sum($scope.transactions, 'amount')

                    return $http.get('/api/getBudget').then(function(result) {

                        var numberOfDays = ($scope.endDate - $scope.startDate) / 1000 / 60 / 60 / 24;
                        var budget = result.data;

                        budget.forEach(function(item) {

                            var transactionsAmount = _.sum($scope.transactions, function(object) {
                                if (object.category === item.category) return object.amount;
                            });

                            if ($scope.amortizeBudget) {
                                item.amount = (item.amount * 12) / 365 * numberOfDays;
                            }

                            var diff = item.amount + transactionsAmount;

                            $scope.categories.push({
                                name: item.category,
                                transactions: [],
                                amount: transactionsAmount,
                                budget: item.amount,
                                diff: diff
                            });
                            $scope.totalBudget += item.amount;


                        });

                        $scope.showlineChart = (new Date($scope.startDate)).getDate() === 1 &&
                            (new Date($scope.startDate)).getMonth() === (new Date($scope.endDate)).getMonth();

                        $scope.barlabels = _.pluck(_.sortBy(budget, 'category'), 'category');
                        $scope.bardata = [_.map(_.pluck(_.sortBy(budget, 'category'), 'amount'), function(n) {
                            return Math.round(n, 2)
                        }), _.map(_.pluck(_.sortBy($scope.categories, 'name'), 'amount'), function(n) {
                            return -Math.round(n, 2);
                        })];

                        $scope.donutlabels = _.pluck(_.sortBy(budget, 'category'), 'category');
                        $scope.donutdata = _.map(_.pluck(_.sortBy($scope.categories, 'name'), 'amount'), function(n) {
                            return -Math.round(n, 2);
                        });

                        $scope.linelabels = [];
                        for (var i = 1; i <= (new Date($scope.endDate)).getDate(); i++) {
                            $scope.linelabels.push(i);
                        }
                        $scope.linedata = [new Array($scope.linelabels.length)]
                        _.fill($scope.linedata[0], 0);

                        angular.forEach($scope.transactions, function(transaction) {
                            var index = (new Date(transaction.date)).getDate();
                            $scope.linedata[0][index - 1] += -Math.round(transaction.amount, 2);
                        });


                    }, errorCb)

                });
        }

        function updateTransaction(transaction) {
            var transaction = {
                reference: transaction.reference,
                description: transaction.description,
                account: transaction.account,
                amount: transaction.amount,
                category: transaction.newCategory
            }
            $http.post('/api/updateTransaction', transaction).then(function() {
                update();
            }, errorCb);
        }

        function addAdvertiser(transaction) {
            var category = {
                name: transaction.description,
                category: transaction.newCategory
            }
            $http.post('/api/addAdvertiser', category).then(function() {
                updateTransaction(transaction);
            }, errorCb);
        }

        function updateAdvertiser(transaction) {
            var category = {
                name: transaction.description,
                category: transaction.newCategory
            }
            $http.post('/api/updateAdvertiser', category).then(function() {
                updateAllTransactions(transaction);
            }, errorCb);
        }

        function updateAllTransactions(transaction) {
            var allTransactions = {
                description: transaction.description,
                category: transaction.newCategory
            }
            $http.post('/api/updateAllTransactions', allTransactions).then(function() {
                update();
            }, errorCb);
        }

        function errorCb(error) {
            $scope.error = error.data;
        }

        function checkDate(transaction) {
            $scope.updated[transaction.account] = new Date(transaction.modified) > $scope.updated[transaction.account] ? transaction.modified : $scope.updated[transaction.account]
        }

        function categoryClick(category) {
            category.show = !category.show;
            angular.forEach($scope.categories, function(cat) {
                if (cat !== category) cat.show = false;
            });
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
