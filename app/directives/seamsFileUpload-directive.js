(function(angular){"use strict";
angular.module("seams")
    .directive("seamsFileUpload", function() {
        return {
            scope: {
                file: "="
            },
            restrict: "E",
            link: function($scope, $element, $attrs, $http) {

                $element.on("change", function(_event) {

                    var file = _event.target.files[0];
                    $scope.file = file;

                });

            },
            template: "<input type='file'/>"
        };
    });
}(angular))
