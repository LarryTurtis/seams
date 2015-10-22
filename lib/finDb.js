var MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    ObjectId = require("mongodb").ObjectID,
    url = "mongodb://localhost:27017/test";

var Category = require('./models/finance_category.js');
var Advertiser = require('./models/finance_advertiser.js');
var Transactions = require('./convertToJson.js');

exports.addAdvertiser = function(req, res) {
    var advertiser = new Advertiser();
    advertiser.name = req.body.name;
    advertiser.category = req.body.category;
    advertiser.save(function(err, category) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        }
        res.send(advertiser);
    });
};

exports.getTransactions = function(req, res) {

    Transactions.getTransactions(req, res);

}

exports.editAdvertiser = function(req, res) {
    Category.find({}, function(err, advertiser) {
        if (err) {
            console.log("Could not get advertiser. " + err);
            res.status(500).send("Could not get advertiser");
        }
        res.send(advertiser);
    })
};

exports.addCategory = function(req, res) {
    var category = new Category();
    category.name = req.body.name;
    category.save(function(err, category) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        }
        res.send(category);
    });
};

exports.getAllAdvertisers = function(req, res) {
    Advertiser.find({}, function(err, advertisers) {
        if (err) {
            console.log("Could not get advertisers. " + err);
            res.status(500).send("Could not get advertisers");
        }
        res.send(advertisers);
    })
};