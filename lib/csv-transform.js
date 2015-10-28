var csv = require('csv');
var fs = require('fs');
var moment = require('moment');


exports.csvTransform = function(file, account) {

var output = [];
var parser = csv.parse({
    delimiter: ',',
    relax: true
})
var input;
var output;
var transformer;

    file = file || process.argv[2];
    account = account || process.argv[3];

        input = fs.createReadStream(file);
        if (account === "amex") {
            transformer = csv.transform(amexTransformer);
        } else if (account === "ally") {
            transformer = csv.transform(allyTransformer);
        } else if (account === "cp1") {
            transformer = csv.transform(cpTransformer);
        }
        output = fs.createWriteStream('data/'+account+'.csv');
        console.log("Transforming " + file + " for " + account + "...")
        input.pipe(parser).pipe(transformer).pipe(output);

}

function amexTransformer(data) {
    var newData = [data[0].split(" ")[0], data[7] * -1, '"' + data[2] + '"', 'amex']
    return (newData).toString() + "\n";
}

function allyTransformer(data) {
    if (data[0] !== "Date") {
        var fixDate = moment(data[0]).format("MM/DD/YYYY");
        var newData = [fixDate, data[2], '"' + data[4] + '"', 'ally']
        return (newData).toString() + "\n";
    }
}

function cpTransformer(data) {
    if (data[7] !== "Transaction Date") {
        var fixDate = moment(data[7]).format("MM/DD/YYYY");
        var newData = [fixDate, data[8], '"' + data[10] + '"', 'cp1']
        return (newData).toString() + "\n";
    }
}
