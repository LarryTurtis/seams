var csv = require('csv');
var fs = require('fs');
var moment = require('moment');

var output = [];
var parser = csv.parse({
    delimiter: ',',
    relax: true
})
var input;
var output;
var transformer;
var file = process.argv[2];

if (file) {
    input = fs.createReadStream(file);
    if (file.split("/").pop() === "amex.csv") {
        transformer = csv.transform(amexTransformer);
    } else if (file.split("/").pop() === "ally.csv") {
        transformer = csv.transform(allyTransformer);
    } else if (file.split("/").pop() === "cp1.csv") {
        transformer = csv.transform(cpTransformer);
    }
    output = fs.createWriteStream('../data/new.csv', {
        'flags': 'a'
    });
    input.pipe(parser).pipe(transformer).pipe(output);
} else {
    output = fs.createWriteStream('../data/new.csv');
    output.write("date, amount, description, account\n");
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
