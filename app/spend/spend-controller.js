(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("spendCtrl", function($scope, $http, seamsAuthService) {

        $scope.isAdmin = false;
        $scope.categories = [];
        $scope.addAdvertiserToCategory = addAdvertiserToCategory;
        $scope.changeAdvertiser = changeAdvertiser;
        $scope.totalAmount = 0;
        $scope.totalBudget = 0;
        $scope.update = update;
        $scope.amortizeBudget = true;

        var date = new Date();
        $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

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
                        return n.amount > 0;
                    });

                    return $http.get('/api/getBudget').then(function(result) {

                        var numberOfDays = ($scope.endDate - $scope.startDate) / 1000 / 60 / 60 / 24;
                        var budget = result.data;

                        budget.forEach(function(item) {

                            if ($scope.amortizeBudget) {
                                item.amount = (item.amount * 12) / 365 * numberOfDays;
                            }
                            $scope.categories.push({
                                name: item.category,
                                transactions: [],
                                amount: 0,
                                budget: item.amount,
                                diff: item.amount
                            });
                            $scope.totalBudget += item.amount;
                        });

                        return $http.get('/api/getAllAdvertisers').then(function(result) {
                            $scope.advertisers = result.data;

                            $scope.transactions.forEach(function(transaction) {

                                $scope.advertisers.forEach(function(advertiser) {

                                    //we have found a matching advertiser for this transaction
                                    if (transaction.description === advertiser.name) {

                                        //assign this transaction to its appropriate category
                                        transaction.category = advertiser.category;

                                        //check if we have already added this category to the scope
                                        var cat = _.find($scope.categories, function(category) {
                                            return category.name === transaction.category;
                                        });

                                        if (cat) {
                                            cat.amount += transaction.amount;
                                            cat.transactions.push(transaction)
                                            cat.diff += transaction.amount
                                        }

                                    }

                                });

                                //hide account transfers.
                                if (transaction.category && transaction.category !== 'Transfer') $scope.totalAmount += transaction.amount;
                            });

                            $scope.uncategorized = _.filter($scope.transactions, function(n) {
                                return !n.category;
                            });
                        });

                    }, errorCb)

                });
        }

        function changeAdvertiser(transaction) {
            var advertiser = {
                name: transaction.description,
                category: transaction.newCategory
            }
            $http.post('/api/updateAdvertiser', advertiser).then(function() {
                update();
            }, errorCb);
        }

        function addAdvertiserToCategory(transaction) {
            var advertiser = {
                name: transaction.description,
                category: transaction.category
            }
            $http.post('/api/addAdvertiser', advertiser).then(function() {
                update();
            }, errorCb);
        }

        function errorCb(error) {
            $scope.error = error.data;
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
