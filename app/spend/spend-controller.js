(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("spendCtrl", function($scope, $http) {

        $scope.isAdmin = false;
        $scope.categories = [];
        $scope.addAdvertiserToCategory = addAdvertiserToCategory;
        $scope.totalAmount = 0;
        $scope.totalBudget = 0;
        $scope.update = update;

        var date = new Date();
        $scope.startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        $scope.endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

        update();

        function update() {
            $scope.transactions = [];
            $scope.categories = [];
            $scope.totalAmount = 0;

            $http.get('/api/getTransactions?startDate=' + $scope.startDate + '&endDate=' + $scope.endDate).then(function(result) {
                $scope.transactions = result.data;
                if (result.headers("Authorization")) {
                    $scope.isAdmin = true;
                }

                _.remove($scope.transactions, function(n) {
                    return n.amount > 0;
                });

                return $http.get('/api/getBudget').then(function(result) {

                    var budget = result.data;
                    $scope.totalBudget = _.sum(budget, function(item){
                        return item.amount;
                    });

                    return $http.get('/api/getAllAdvertisers').then(function(result) {
                        $scope.advertisers = result.data;

                        $scope.transactions.forEach(function(transaction) {

                            $scope.advertisers.forEach(function(advertiser) {
                                
                                //get a matching budget for this advertiser's category
                                var budgetedAmount = _.find(budget, function(item) {
                                    return item.category === advertiser.category
                                })

                                //we have found a matching advertiser for this transaction
                                if (transaction.description === advertiser.name) {

                                    //assign this transaction to its appropriate category
                                    transaction.category = advertiser.category;

                                    //check if we have already added this category to the scope
                                    var cat = _.find($scope.categories, function(category) {
                                        return category.name === transaction.category;
                                    });

                                    //if so, increment the amount
                                    if (cat) {
                                        cat.amount += transaction.amount;
                                        cat.transactions.push(transaction)
                                        cat.diff += transaction.amount
                                    } else {
                                        //or else initialize the object.
                                        if (transaction.category !== 'Transfer') {
                                            $scope.categories.push({
                                                name: transaction.category,
                                                amount: transaction.amount,
                                                transactions: [transaction],
                                                budget: budgetedAmount && budgetedAmount.amount,
                                                diff: budgetedAmount && budgetedAmount.amount + transaction.amount
                                            });
                                        }
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

                })

            });
        }

        function addAdvertiserToCategory(transaction) {
            var advertiser = {
                name: transaction.description,
                category: transaction.category
            }
            $http.post('/api/addAdvertiser', advertiser);
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
