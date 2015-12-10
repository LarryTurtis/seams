var Category = require('./models/finance_category.js');
var Advertiser = require('./models/finance_advertiser.js');
var Budget = require('./models/finance_budget.js');
var Transactions = require('./models/finance_transaction.js');
var mongoose = require('mongoose');
var max = require("../max.js");
var counter = 1;

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

exports.addTransaction = function(data) {
    var transactions = new Transactions();
    transactions.description = data.description;
    transactions.modified = data.modified;
    transactions.date = data.date;
    transactions.reference = data.reference;
    transactions.account = data.account;
    transactions.amount = data.amount;
    return Advertiser.find({
        "name": data.description
    }, function(err, advertiser) {
        transactions.category = advertiser[0] && advertiser[0].category
        return transactions.save(function(err, transaction) {
            if (err) {
                console.log(err.errmsg)
            } else {
                console.log("Saved " + transaction.description)
            }
            if (max.getMax() && max.getMax() === counter) {
                mongoose.disconnect(function() {
                    console.log("Processed " + counter + " records, exiting.");
                    console.log((new Date()).toString());
                    process.exit();
                });
            }
            counter++;
        });
    })
}

exports.updateAdvertiser = function(req, res) {
    Advertiser.update({
        name: req.body.name
    }, {
        category: req.body.category
    }, {
        multi: true
    }, function(err, advertiser) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(advertiser);
        }
    });
};

exports.updateTransaction = function(req, res) {
    console.log('updateTransaction!', req.body)
    Transactions.update({
        reference: req.body.reference
    }, {
        category: req.body.category
    }, function(err, transaction) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(transaction);
        }
    });
};

exports.updateAllTransactions = function(req, res) {
    Transactions.update({
        description: req.body.description
    }, {
        category: req.body.category
    }, {
        multi: true
    }, function(err, transaction) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(transaction);
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
    Transactions.find({
        date: {
            $gte: req.query.startDate,
            $lte: req.query.endDate
        }
    }, function(err, transactions) {
        if (err) {
            console.log("Could not get transactions. " + err);
            res.status(500).send("Could not get transactions");
        }
        res.send(transactions);
    })
}

exports.deleteAllTransactions = function(req, res) {
    Transactions.remove({}, function(err, transactions) {
        if (err) {
            console.log("Could not get transactions. " + err);
            res.status(500).send("Could not get transactions");
        }
        res.send(transactions);
    })
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
