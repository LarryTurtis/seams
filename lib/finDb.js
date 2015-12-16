var Vendor = require('./models/finance_vendor.js');
var Budget = require('./models/finance_budget.js');
var Transactions = require('./models/finance_transaction.js');
var mongoose = require('mongoose');
var max = require("../max.js");
var counter = 1;

exports.addVendor = function(req, res) {
    var vendor = new Vendor();
    vendor.name = req.body.name;
    vendor.category = req.body.category;
    vendor.save(function(err, category) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(vendor);
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
    return Vendor.find({
        "name": data.description
    }, function(err, vendor) {
        transactions.category = vendor[0] && vendor[0].category
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

exports.updateVendor = function(req, res) {
    Vendor.update({
        name: req.body.name
    }, {
        category: req.body.category
    }, {
        multi: true
    }, function(err, vendor) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        } else {
            res.send(vendor);
        }
    });
};

exports.updateTransaction = function(req, res) {
    console.log('updateTransaction!', req.body)
    Transactions.update({
        reference: req.body.reference,
        description: req.body.description,
        account: req.body.account
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

exports.updateBudget = function(req, res) {
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

exports.getBudget = function(req, res) {
    Budget.find({}, function(err, budget) {
        if (err) {
            console.log("Could not get budget. " + err);
            res.status(500).send("Could not get budget");
        }
        res.send(budget);
    })
};