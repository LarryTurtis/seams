var MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    ObjectId = require("mongodb").ObjectID,
    url = "mongodb://localhost:27017/test";

var Category = require('./models/finance_category.js');
var Advertiser = require('./models/finance_advertiser.js');
var Budget = require('./models/finance_budget.js');
var Transactions = require('./convertToJson.js');

exports.addAdvertiser = function(req, res) {
    var advertiser = new Advertiser();
    advertiser.name = req.body.name;
    advertiser.category = req.body.category;
    advertiser.save(function(err, category) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(advertiser);
        }
    });
};

exports.addToBudget = function(req, res) {
    Budget.remove().then(function() {
        Budget.create(req.body, function(err, budget) {
            if (err) {
                console.log("Error in saving to the database." + err);
                res.status(500).send("Could not save to database.");
            } else {
                res.send(budget);
            }
        });
    })
};


exports.getTransactions = function(req, res) {
    Transactions.getTransactions(req, res);
}

exports.deleteAdvertiser = function(req, res) {
    console.log(req.body)
    var name = req.body.name;
    console.log(name)
    Advertiser.find({
        name: name
    }).remove(function() {
        res.send('Deleted!');
    });

}

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

exports.getBudget = function(req, res) {
    Budget.find({}, function(err, budget) {
        if (err) {
            console.log("Could not get budget. " + err);
            res.status(500).send("Could not get budget");
        }
        res.send(budget);
    })
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

exports.getAllCategories = function(req, res) {
    Category.find({}, function(err, categories) {
        if (err) {
            console.log("Could not get categories. " + err);
            res.status(500).send("Could not get categories");
        }
        res.send(categories);
    })
};
