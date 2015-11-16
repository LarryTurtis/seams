var Transactions = require('./models/finance_transaction.js');
var Advertiser = require('./models/finance_advertiser.js');


exports.saveData = function(data) {
    var transactions = new Transactions();

    transactions.description = data.description;
    transactions.modified = data.modified;
    transactions.date = data.date;
    transactions.reference = data.reference;
    transactions.account = data.account;
    transactions.amount = data.amount;

    Advertiser.find({"name":data.description}, function(err, advertiser) {
        if (err) {
            console.log("Could not get transactions. " + err);
            res.status(500).send("Could not get transactions");
        }
        console.log('saving transaction' + transactions.category)
        transactions.category = advertiser.category
        transactions.save(function(err, transaction) {
            if (err) {
                console.log("Error in saving to the database." + err);
            }
        });
    })

}
