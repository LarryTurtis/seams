"use strict";
angular.module("seams")
    .directive("seamsFileUpload", function() {
        return {
            scope: {
                file: "="
            },
            restrict: "E",
            link: function($scope, $element) {

                $element.on("change", function(_event) {

                    $scope.file = _event.target.files[0]

                });

            },
            template: "<input type='file'/>"
        };
    });
