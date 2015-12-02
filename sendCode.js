 /**
 *curl 'https://securebanking.ally.com/IDPProxy/executor/session' -H 'ApplicationName: AOB' -H 'X-Requested-With: XMLHttpRequest' -H 'Connection: keep-alive' 
 * -H 'patron-id: olbWeb' -H 'ApplicationId: ALLYUSBOLB'  -H 'Content-Type: application/x-www-form-urlencoded' -H 'ApplicationVersion: 1.0' 
 * --data 'userNamePvtEncrypt=YOURUSERNAME&rememberMeFlag=false&passwordPvtBlock=YOURPASSWORD' --compressed
 *
 * curl 'https://securebanking.ally.com/IDPProxy/executor/session/consents' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' 
 * -H 'Accept: application/json, text/javascript, *\/*; q=0.01' -H 'Cookie: idp-jsessionid=Mmpj8JP6hTNzmBCcY2Qtyk1khD0nF-H-bBMpKyDEYl2S7BbFNlZh!748649212;' 
 * -H 'Connection: keep-alive' -H 'patron-id: olbWeb' -H 'CSRFChallengeToken: 244939929466227007195189140279564179' --compressed -v
 *
 * curl 'https://securebanking.ally.com/IDPProxy/executor/accounts' -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' 
 * -H 'Accept: application/json, text/javascript, *\/*; q=0.01' -H 'Cookie: idp-jsessionid=Mmpj8JP6hTNzmBCcY2Qtyk1khD0nF-H-bBMpKyDEYl2S7BbFNlZh!748649212 ' -H 'Connection: keep-alive' 
 * -H 'patron-id: olbWeb' -H 'CSRFChallengeToken: 244939929466227007195189140279564179' --compressed
 *
 * curl 'https://securebanking.ally.com/IDPProxy/executor/accounts/29864092/transactions.csv?patron-id=olbWeb&fromDate=2015-11-01&toDate=2015-12-02&status=Posted' 
 * -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*\/*;q=0.8' -H 'Cache-Control: no-cache' 
 * -H 'Cookie: idp-jsessionid=Mmpj8JP6hTNzmBCcY2Qtyk1khD0nF-H-bBMpKyDEYl2S7BbFNlZh!748649212' --compressed -v
 */

var querystring = require('querystring');
var http = require('https');
var fs = require('fs');
var csvTransformer = require("./lib/csv-transform.js");
var file = "/Users/garykertis/seams-upload/data/data1.csv";
var csv = require('csv');
var mongoose = require('mongoose');
var _ = require("lodash");
mongoose.disconnect(function() {
    mongoose.connect("mongodb://localhost:27017/test");
});
var max = require("./max.js");
var sessioncookie;
var challengetoken;
var accountId;

login()

function login() {
    // Build the post string from an object
    var post_data = 'javaScriptData=TF1%3B015%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3BMozilla%3BNetscape%3B5.0%2520%2528Macintosh%253B%2520Intel%2520Mac%2520OS%2520X%252010_10_2%2529%2520AppleWebKit%2F537.36%2520%2528KHTML%252C%2520like%2520Gecko%2529%2520Chrome%2F46.0.2490.86%2520Safari%2F537.36%3B20030107%3Bundefined%3Btrue%3B%3Btrue%3BMacIntel%3Bundefined%3BMozilla%2F5.0%2520%2528Macintosh%253B%2520Intel%2520Mac%2520OS%2520X%252010_10_2%2529%2520AppleWebKit%2F537.36%2520%2528KHTML%252C%2520like%2520Gecko%2529%2520Chrome%2F46.0.2490.86%2520Safari%2F537.36%3Ben-US%3Bwindows-1252%3Bsecurebanking.ally.com%3Bundefined%3Bundefined%3Bundefined%3Bundefined%3Btrue%3Bfalse%3B1449091728042%3B-5%3B6%2F7%2F2005%252C%25209%253A33%253A44%2520PM%3B1920%3B1080%3B%3B19.0%3B%3B%3B%3B%3B1%3B300%3B240%3B12%2F2%2F2015%252C%25204%253A28%253A48%2520PM%3B24%3B1920%3B1057%3B1440%3B-157%3B%3B%3B%3B%3B%3BShockwave%2520Flash%257CShockwave%2520Flash%252019.0%2520r0%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B22%3B&' + 
    'otpCodePvtBlock=194164' + '&deviceTokenFso=PMV62B%2Bwy1LYiuNAANETooo34B5pyG2TQ1dSjBZWDQvNVeY4N57FL7BmOHY5N9VQBBcyVoxNTjjiGa%2FV3T117E0x828A%3D%3D&_method=PATCH';
    // An object of options to indicate where to post to
    var post_options = {
        host: 'securebanking.ally.com',
        port: '443',
        path: '/IDPProxy/executor/session',
        method: 'POST',
        headers: {
            'patron-id': 'olbWeb',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'ApplicationVersion': '1.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'CSRFChallengeToken': 'what',
            'Cookie': 'what'
        }
    };

    // Set up the request
    var post_req = http.request(post_options, authenticate);

    // post the data
    post_req.write(post_data);
    post_req.end();

}


function authenticate(res) {
    res.setEncoding('utf8');
    var body = "";
    res.on("data", function(chunk){
        body += chunk;
    }).on("end", function(){
        console.log(JSON.parse(body));
    })
}

