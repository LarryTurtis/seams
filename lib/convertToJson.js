//Converter Class
var Converter = require("csvtojson").core.Converter;
var lodash = require("lodash");
var jsonArray;
var sendResult = sendResult;

exports.getTransactions = function(req, res) {

    //read from file
    var readStream = require("fs").createReadStream("./data/new.csv");

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

                res.send(jsonArray);
            });

        readStream.pipe(converter);
    });

    readStream.on('error', function(err) {
        res.send(err);
    });

};
