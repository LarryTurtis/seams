//Converter Class
var Converter = require("csvtojson").core.Converter;
var lodash = require("lodash");
var jsonArray;
var sendResult = sendResult;
var concat = require('concat-files');
var fs = require("fs");
var q = require("q");

exports.getTransactions = function(req, res) {

    var header = 'data/header.csv';
    var amex = 'data/amex.csv';
    var ally = 'data/ally.csv';
    var cp1 = 'data/cp1.csv';
    var output = 'data/new.csv'
    var updated = {}

    getMTime(amex)
        .then(function(time) {
            updated.amex = time;
            return ally;
        })
        .then(getMTime)
        .then(function(time) {
            updated.ally = time;
            return cp1;
        })
        .then(getMTime)
        .then(function(time) {
            updated.cp1 = time
            concat([header, amex, ally, cp1], output, process);
        })

    function getMTime(path) {
        var defer = q.defer();
        fs.stat(path, function(err, stats) {
            defer.resolve(stats.mtime)
        })
        return defer.promise;
    }

    function process() {
        //read from file
        var readStream = fs.createReadStream(output);

        readStream.on('open', function() {
            // This just pipes the read stream to the response object (which goes to the client)
            var converter = new Converter({});
            converter.on("end_parsed",
                function(json) {

                    jsonArray = json;

                    if (req.query.startDate && req.query.startDate !== "undefined") {
                        var testDate = new Date(Date.parse(req.query.startDate));
                        lodash.remove(jsonArray, function(item) {
                            var actualDate = new Date(Date.parse(item.date));
                            return actualDate < testDate;
                        });
                    }

                    if (req.query.endDate && req.query.endDate !== "undefined") {
                        var testDate = new Date(Date.parse(req.query.endDate));
                        lodash.remove(jsonArray, function(item) {
                            var actualDate = new Date(Date.parse(item.date));
                            return actualDate > testDate;
                        });
                    }

                    res.send([jsonArray, updated]);

                });

            readStream.pipe(converter);
        });

        readStream.on('error', function(err) {
            res.send(err);
        });
    }

};
