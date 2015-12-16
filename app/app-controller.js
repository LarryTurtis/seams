(function(angular) {
    "use strict";
    angular.module("seams")
    .controller("seamsCtrl", function($http, $scope, $location, seamsAuthService) {

        $scope.isAdmin = seamsAuthService.getAuth();

        $scope.checkLocation = function(name) {
            return $location.path() === name;
        };

        $scope.getClass = function(path) {
            if ($location.path().substr(0, path.length) === path) {
                return 'active';
            } else {
                return '';
            }
        }
    })
})(angular);