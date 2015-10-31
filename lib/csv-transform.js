var csv = require('csv');
var fs = require('fs');
var moment = require('moment');
var db = require('./finDb.js');

exports.csvTransform = function(file, account) {

    var input;
    var transformer;
    var columns = true;

    file = file || process.argv[2];
    account = account || process.argv[3];

    input = fs.createReadStream(file);
    if (account === "amex") {
        transformer = csv.transform(amexTransformer);
        columns = ["date", "a", "description", "b", "c", "d", "e", "amount", "f", "g", "h", "i", "j", "k", "reference", "l", "m"];
    } else if (account === "ally") {
        transformer = csv.transform(allyTransformer);
    } else if (account === "cp1") {
        transformer = csv.transform(cpTransformer);
    }

    var parser = csv.parse({
        delimiter: ',',
        relax: true,
        columns: columns
    });

    console.log("Transforming " + file + " for " + account + "...")
    input.pipe(parser).pipe(transformer);

}

function amexTransformer(data) {
    data.date = data.date.split(" ")[0];
    data.modified = moment().format("MM/DD/YYYY")
    data.amount = data.amount * -1;
    data.account = 'amex';
    db.addTransaction(data);
}

function allyTransformer(data) {
    data.date = moment(data["Date"]).format("MM/DD/YYYY");
    data.modified = moment().format("MM/DD/YYYY")
    data.amount = data[" Amount"];
    data.description = data[" Description"];
    data.reference = data[" Time"];
    data.account = 'ally';
    db.addTransaction(data);

}

function cpTransformer(data) {
    data.date = moment(data["Transaction Date"]).format("MM/DD/YYYY");
    data.modified = moment().format("MM/DD/YYYY")
    data.amount = data["Transaction Amount"];
    data.reference = data["Transaction ID"];
    data.account = "cp1";
    data.description = data[" Transaction Description"];
    db.addTransaction(data);
}
