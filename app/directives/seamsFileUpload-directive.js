(function(angular) {
    "use strict";
    angular.module("seams")
        .directive("seamsFileUpload", function() {
            return {
                scope: {
                    account: "="
                },
                restrict: "E",
                link: function($scope, $element) {
                    $element.on("change", function(_event) {
                        var file = _event.target.files[0];
                        $scope.file = file;
                    });
                },
                controller: function($scope, seamsFileUploadService) {
                    $scope.upload = function() {
                        if ($scope.account) {
                            $scope.message = "";
                            seamsFileUploadService.upload($scope.file, $scope.account).then(function(result) {
                                console.log(result)
                            })
                        } else {
                            $scope.message = "You must select an account.";
                        }
                    }

                },
                templateUrl: "directives/seams-file-upload.html"
            };
        });
}(angular))
