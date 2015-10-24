var csv = require('csv');
var fs = require('fs');

var output = [];
var parser = csv.parse({
    delimiter: ',',
    relax: true
})
var input = fs.createReadStream('../data/amex.csv');
var output = fs.createWriteStream('../data/new.csv', {'flags': 'a'});
var transformer = csv.transform(function(data) {
	console.log(data[2])
    var newData = [data[0].split(" ")[0], data[7], '"' + data[2] + '"', 'amex']
    return (newData).toString() + "\n";
});

input.pipe(parser).pipe(transformer).pipe(output);

