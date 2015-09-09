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
                default:
                    return false;
            }
        };

        var upload = function(file, destination) {
            if (verifyImage(file.type)) {
                var fd = new FormData();
                fd.append('avatar', file);
                return $http.post('/api/upload', fd, {
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'destination': "./app" + destination
                    }
                });
            }
        };

        return {
            upload: upload
        }
    });
}(angular));
