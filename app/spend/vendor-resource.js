(function(angular) {
    "use strict";

    angular.module("spend")
        .factory("VendorResource", VendorResource);

    VendorResource.$inject = ["$resource"];

    function VendorResource($resource) {
        return $resource("/api/vendor/", null, {
            update: {
                method: "PUT",
            },
            create: {
                method: "POST",
            }
        });
    }
})(angular);
