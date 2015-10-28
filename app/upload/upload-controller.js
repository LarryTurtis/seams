(function(angular) {
    'use strict';

    angular.module('seams')

    .controller("uploadCtrl", function($scope, seamsAuthService) {

        $scope.isAdmin = seamsAuthService.getAuth();

    });
})(angular);
