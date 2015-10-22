(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("budgetCtrl", function($scope, $http) {

        $scope.isAdmin = false;
        $scope.categories = [];
        $scope.addCategory = addCategory;
        $scope.addAdvertiserToCategory = addAdvertiserToCategory;
        $scope.totalAmount = 0;
        $scope.update = update;

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

                $http.get('/api/getAllAdvertisers').then(function(result) {
                    $scope.advertisers = result.data;

                    $scope.transactions.forEach(function(transaction) {
                        $scope.advertisers.forEach(function(advertiser) {
                            if (transaction.description === advertiser.name) {
                                transaction.category = advertiser.category;

                                var cat = _.find($scope.categories, function(category) {
                                    return category.name === transaction.category;
                                });

                                if (cat) {
                                    cat.amount += transaction.amount;
                                } else {
                                    if (transaction.category !== 'Transfer') {
                                        $scope.categories.push({
                                            name: transaction.category,
                                            amount: transaction.amount
                                        });
                                    }
                                }
                            }

                        });
                        if (transaction.category && transaction.category !== 'Transfer') $scope.totalAmount += transaction.amount;
                    });

                    $scope.uncategorized = _.filter($scope.transactions, function(n) {
                        return !n.category;
                    });

                });

            });
        }

        function addCategory() {
            $http.post('/api/addCategory', $scope.category);
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
