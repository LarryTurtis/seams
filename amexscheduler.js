// We need this to build our post string
var querystring = require('querystring');
var http = require('https');
var fs = require('fs');
var csvTransformer = require("./lib/csv-transform.js");
var file = "/Users/garykertis/seams-upload/data/data1.csv";
var csv = require('csv');
var mongoose = require('mongoose');
mongoose.disconnect(function() {
    mongoose.connect("mongodb://localhost:27017/test");
});
var max = require("./max.js");

function PostCode() {
    // Build the post string from an object
    var post_data = process.argv[2];

    // An object of options to indicate where to post to
    var post_options = {
        host: 'online.americanexpress.com',
        port: '443',
        path: '/myca/logon/us/action/LogLogonHandler?request_type=LogLogonHandler&Face=en_US',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    // Set up the request
    var post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        var cookie = res.headers['set-cookie'][2].split(";")[0] + ';' + res.headers['set-cookie'][3].split(";")[0] + ';' + res.headers['set-cookie'][5].split(";")[0] + ';';
        var data2 = 'sorted_index=0&BPIndex=-97&suppIndex=&liteEnabled=false&mycaLite=false&startDate=01012015&endDate=12312025&sortBy=1&sortOrder=A&sortClicked=false&request_type=authreg_Statement&Face=en_US&refSeNumbers=&downloadType=C&downloadView=C&numberOfPages=100&totalTrans=5000&totalTransCount=5000&jsonEtd=false&downloadWithETDTool=true&viewType=L&reportType=1';

        var options2 = {
            host: 'online.americanexpress.com',
            port: '443',
            path: '/myca/estmt/us/downloadTxn.do',
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(data2),
                'Cookie': cookie
            }
        };

        var post2 = http.request(options2, function(res) {
            res.setEncoding('utf8');
                var parser = csv.parse({
                    delimiter: ',',
                    relax: true,
                    columns: ["date", "a", "description", "b", "c", "d", "e", "amount", "f", "g", "h", "i", "j", "k", "reference", "l", "m"]  
                });

                var transformer = csv.transform(csvTransformer.amexTransformer)

                res.pipe(parser).pipe(transformer);

                parser.on("readable", function() {
                    max.setMax(parser.count);
                })
        })

        post2.write(data2);
        post2.end();

    });

    // post the data
    post_req.write(post_data);
    post_req.end();

}

PostCode()
