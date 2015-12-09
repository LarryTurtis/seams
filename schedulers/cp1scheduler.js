var http = require('https');
var querystring = require('querystring');
var request = require("request");
var csvTransformer = require("../lib/csv-transform.js");
var csv = require('csv');
var mongoose = require('mongoose');
mongoose.disconnect(function() {
    mongoose.connect("mongodb://localhost:27017/test");
});
var max = require("../max.js");
var cookies = "BIGipServerpl_secure.capitalone360.com_80=1746970816.20480.0000;";
var today = new Date();
var year = today.getFullYear();

login()

function login() {
    // Build the post string from an object
    var post_data = "UserType=Client&AuthenticationType=Primary&ApplicationType=ViewAccount&from=NewPage&publicUserId=" + process.argv[2];
    var body = "";
    var req = request.post({
        uri: 'https://secure.capitalone360.com/myaccount/banking/login.vm',
        headers: {
            'Accept': '*/*',
            'Cookie': cookies,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(post_data)
        },
        followAllRedirects: true,
        form: post_data
    }).on("data", function(chunk) {
        body += chunk;
    }).on("end",
        function() {
            var sessioncookie = req.headers.referer.split(";")[1] + ";";
            cookies += sessioncookie.toUpperCase();
            sendPass(getPageToken(body))
        });
}


function sendPass(pageToken) {

    var post_data = querystring.stringify({
        "pageToken": pageToken,
        "in_dp": "version=2",
        "_eventId": "continue",
        "currentPassword_TLNPI": process.argv[3]
    });

    var post_options = {
        host: 'secure.capitalone360.com',
        port: '443',
        path: '/myaccount/banking/loginauthentication?execution=e1s1',
        method: 'POST',
        headers: {
            'User-Agent': 'curl/7.37.1',
            'Accept': '*/*',
            'Accept-Encoding': 'deflate, gzip',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookies,
            'Connection': 'keep-alive',
            'Content-Length': Buffer.byteLength(post_data)
        }
    };

    var post_req = http.request(post_options, postLogin)
    post_req.write(post_data);
    post_req.end();
}

function postLogin(res) {

    res.headers["set-cookie"].forEach(function(cookie) {
        cookies += cookie.split(";")[0] + ";";
    });

    request.get({
        uri: 'https://secure.capitalone360.com/myaccount/banking/postlogin',
        method: 'GET',
        headers: {
            'User-Agent': 'curl/7.37.1',
            'Accept': '*/*',
            'Accept-Encoding': 'deflate, gzip',
            'Cookie': cookies,
            'Connection': "keep-alive",
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    }).on("end", function() {
        getPT()
    });


}

function getPT() {
    var body = "";
    var req = request.get({
        uri: 'https://secure.capitalone360.com/myaccount/banking/accountSummaryGateway?goToState=downloadTransactions&fromPage=account_summary.vm',
        headers: {
            'Accept': '*/*',
            'Cookie': cookies
        },
        followAllRedirects: true,
    }).on("data", function(chunk) {
        body += chunk;
    }).on("end",
        function() {
            download(getPageToken(body))
        });
}

function download(pageToken) {
    var post_data = 'pageToken=' + pageToken + '&account=%24accountNumber&nickname=%24NickName&description=%24AccountDescription&timeframe=STANDARD&_flowExecutionKey=e2s1&_eventId=download&transactionPeriod=YTD&startDate=01%2F01%2F'+year+'&endDate=12%2F31%2F'+year+'&type=CSV';
    var body = "";

    var parser = csv.parse({
        delimiter: ',',
        relax: true,
        columns: true
    });

    var transformer = csv.transform(csvTransformer.cpTransformer)

    parser.on("readable", function() {
        max.setMax(parser.count);
    })

    var req = request.post({
        uri: 'https://secure.capitalone360.com/myaccount/banking/accountSummaryGateway?execution=e2s1&dnr=-1',
        headers: {
            'Accept': '*/*',
            'Cookie': cookies,
        },
        form: post_data,
        followAllRedirects: true,
    }).pipe(parser).pipe(transformer)
}


function getPageToken(body) {
    var index = body.search('pageToken" value="');
    var p1 = body.substring(index, index + 100);
    var end = p1.search('/');
    var partial = body.substring(index, index + end);
    return partial.split('"')[2];
}
