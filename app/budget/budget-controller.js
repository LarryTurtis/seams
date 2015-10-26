(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("budgetCtrl", function($scope, $http, $location) {

        $scope.income = 7325;
        $scope.update = update;
        $scope.total = 0;

        $http.get('/api/getBudget').then(function(result) {
            $scope.budget = result.data;
            $scope.budget.push({'category': null, 'amount': 0});
            $scope.budget.forEach(function(item){
                $scope.total += item.amount;
            })
        });

        function update() {
            if (!_.last($scope.budget).category) {
                $scope.budget.pop();
            }
            $http.post('/api/addToBudget', $scope.budget).then(function() {
            $location.path('/spend')
        });   
        }

    });
})(angular);
