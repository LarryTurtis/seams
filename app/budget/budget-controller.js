(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("budgetCtrl", function($scope, $http, $location, seamsAuthService) {

        $scope.income = 7325;
        $scope.update = update;
        $scope.total = 0;
        $scope.isAdmin = seamsAuthService.getAuth();

        $http.get('/api/budget').then(function(result) {
            $scope.budget = result.data;
            $scope.budget.push({
                'category': null,
                'amount': 0
            });
            $scope.budget.forEach(function(item) {
                $scope.total += item.amount;
                item.subCategories && item.subCategories.push({name: ""});
            })
            console.log($scope.budget);
        });

        function update() {
            if (!_.last($scope.budget).category) {
                $scope.budget.pop();
            }
            $http.put('/api/budget', $scope.budget).then(function() {
                $location.path('/spend')
            });
        }

        $scope.$watch('budget', function(){
            $scope.labels = _.pluck($scope.budget, 'category');
            $scope.data = _.pluck($scope.budget, 'amount');
        }, true)

    });
})(angular);
