(function(angular) {
    "use strict";
    angular.module("seams").service("seamsFileUploadService", function($http) {

        var verifyImage = function(type) {
            switch (type) {
                case "image/gif":
                    return true;
                case "image/png":
                    return true;
                case "image/jpeg":
                    return true;
                case "text/csv":
                    return true;
                default:
                    return false;
            }
        };

        var upload = function(file, account) {
            if (verifyImage(file.type)) {
                var fd = new FormData();
                fd.append('avatar', file);
                return $http.post('/api/upload', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'destination': "data",
                        'account': account
                    }
                });
            }
        };

        return {
            upload: upload
        }
    });
}(angular));
