(function(angular) {
    "use strict";
    angular.module("seams").service("seamsAuthService", function() {

        var authenticated;

        function setAuth(auth) {
            authenticated = auth;
        }

        function getAuth() {
            return authenticated;
        }

        return {
            setAuth: setAuth,
            getAuth: getAuth
        }
    });
}(angular));
