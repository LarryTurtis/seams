//Converter Class
var Converter = require("csvtojson").core.Converter;
var converter = new Converter({});

exports.getTransactions = function(req, res) {

    //end_parsed will be emitted once parsing finished
    converter.on("end_parsed", function(jsonArray) {
        res.send(jsonArray);
    });

    //read from file
    require("fs").createReadStream("./data/data.csv").pipe(converter);
};
