var Transactions = require('./models/finance_transaction.js');


exports.saveData = function(data) {
    var transactions = new Transactions();

    transactions.description = data.description;
    transactions.modified = data.modified;
    transactions.date = data.date;
    transactions.reference = data.reference;
    transactions.account = data.account;
    transactions.amount = data.amount;

    transactions.save(function(err, transaction) {
        if (err) {
            console.log("Error in saving to the database." + err);
        }
    });
}
