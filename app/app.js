'use strict';

(function(angular) {

    angular.module('seams', ['AngularStore'])

    .controller("seamsCtrl", function($scope) {
        $scope.products = [{
            "id": "APL",
            "name": "Apple",
            "description": "Eat one every day to keep the doctor away!",
            "price": 12,
            "cal": 90,
            "carot": 0,
            "vitc": 2,
            "folate": 0,
            "potassium": 1,
            "fibe": 2
        }, {
            "id": "BAN",
            "name": "Banana",
            "description": "These are rich in Potassium and easy to peel.",
            "price": 4,
            "cal": 120,
            "carot": 0,
            "vitc": 1,
            "folate": 2,
            "potassium": 2,
            "fibe": 2
        }, {
            "id": "CTP",
            "name": "Cantaloupe",
            "description": "Delicious and refreshing.",
            "price": 3,
            "cal": 50,
            "carot": 4,
            "vitc": 4,
            "folate": 1,
            "potassium": 2,
            "fibe": 0
        }, {
            "id": "CTP",
            "name": "Cantaloupe",
            "description": "Delicious and refreshing.",
            "price": 3,
            "cal": 50,
            "carot": 4,
            "vitc": 4,
            "folate": 1,
            "potassium": 2,
            "fibe": 0
        }, {
            "id": "FIG",
            "name": "Fig",
            "description": "OK, not that nutritious, but sooo good!",
            "price": 10,
            "cal": 100,
            "carot": 0,
            "vitc": 0,
            "folate": 0,
            "potassium": 1,
            "fibe": 2
        }, {
            "id": "GRF",
            "name": "Grapefruit",
            "description": "Pink or red, always healthy and delicious.",
            "price": 11,
            "cal": 50,
            "carot": 4,
            "vitc": 4,
            "folate": 1,
            "potassium": 1,
            "fibe": 1
        }, {
            "id": "GRP",
            "name": "Grape",
            "description": "Wine is great, but grapes are even better.",
            "price": 8,
            "cal": 100,
            "carot": 0,
            "vitc": 3,
            "folate": 0,
            "potassium": 1,
            "fibe": 1
        }, {
            "id": "GUA",
            "name": "Guava",
            "description": "Exotic, fragrant, tasty!",
            "price": 8,
            "cal": 50,
            "carot": 4,
            "vitc": 4,
            "folate": 0,
            "potassium": 1,
            "fibe": 2
        }, {
            "id": "KIW",
            "name": "Kiwi",
            "description": "These come from New Zealand.",
            "price": 14,
            "cal": 90,
            "carot": 1,
            "vitc": 4,
            "folate": 0,
            "potassium": 2,
            "fibe": 2
        }, {
            "id": "LYC",
            "name": "Lychee",
            "description": "Unusual and highly addictive!",
            "price": 14,
            "cal": 90,
            "carot": 1,
            "vitc": 4,
            "folate": 0,
            "potassium": 2,
            "fibe": 2
        }];

    });

})(angular);
