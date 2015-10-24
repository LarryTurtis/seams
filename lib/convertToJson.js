//Converter Class
var Converter = require("csvtojson").core.Converter;
var converter = new Converter({});
var lodash = require("lodash");

var jsonArray;

exports.getTransactions = function(req, res) {

    if (jsonArray) {

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

        res.send(jsonArray);
    } else {

        //end_parsed will be emitted once parsing finished
        converter.on("end_parsed", function(json) {
            jsonArray = json;
            res.send(jsonArray);
        });

        //read from file
        var readStream = require("fs").createReadStream("./data/new.csv");

        readStream.on('open', function() {
            // This just pipes the read stream to the response object (which goes to the client)
            readStream.pipe(converter);
        });

        readStream.on('error', function(err) {
            res.send(err);
        });
    }
};
