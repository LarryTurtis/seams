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
    var post_data = 'javaScriptData=TF1%3B015%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3BMozilla%3BNetscape%3B5.0%2520%2528Macintosh%253B%2520Intel%2520Mac%2520OS%2520X%252010_10_2%2529%2520AppleWebKit%2F537.36%2520%2528KHTML%252C%2520like%2520Gecko%2529%2520Chrome%2F46.0.2490.86%2520Safari%2F537.36%3B20030107%3Bundefined%3Btrue%3B%3Btrue%3BMacIntel%3Bundefined%3BMozilla%2F5.0%2520%2528Macintosh%253B%2520Intel%2520Mac%2520OS%2520X%252010_10_2%2529%2520AppleWebKit%2F537.36%2520%2528KHTML%252C%2520like%2520Gecko%2529%2520Chrome%2F46.0.2490.86%2520Safari%2F537.36%3Ben-US%3Bwindows-1252%3Bsecurebanking.ally.com%3Bundefined%3Bundefined%3Bundefined%3Bundefined%3Btrue%3Bfalse%3B1449093448333%3B-5%3B6%2F7%2F2005%252C%25209%253A33%253A44%2520PM%3B1920%3B1080%3B%3B19.0%3B%3B%3B%3B%3B2%3B300%3B240%3B12%2F2%2F2015%252C%25204%253A57%253A28%2520PM%3B24%3B1920%3B1057%3B1440%3B-157%3B%3B%3B%3B%3B%3BShockwave%2520Flash%257CShockwave%2520Flash%252019.0%2520r0%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B%3B22%3B&deviceTokenFso=PMV62BccM0vS3c3Aqz4tPhHwqF7i97SRvKHcyDmNYsKZLRa2%252FZGja93NS7kGxSjBTsVV6faLI3OlfvXqj%252F6BC%252By59SlA%253D%253D';
    // An object of options to indicate where to post to
    var post_options = {
        host: 'securebanking.ally.com',
        port: '443',
        path: '/IDPProxy/executor/device',
        method: 'POST',
        headers: {
            'patron-id': 'olbWeb',
            'accept': 'application/json, text/javascript, */*; q=0.01',
            'ApplicationVersion': '1.0',
            'Content-Type': 'application/x-www-form-urlencoded',
            'CSRFChallengeToken': 'what',
            'Cookie': 'Cookie: QSI_SI_9oTsF678iVicnnT_intercept=true; BIGipServer~Production~pool.prod-a.cportlv.1010x=1247291402.31271.0000; ad_sess=true; __utma=170055408.237206466.1448469332.1449087922.1449091215.8; __utmc=170055408; __utmz=170055408.1448469332.1.1.utmcsr=(direct)|utmccn=(direct)|utmcmd=(none); aam_sc=seg%3DgenericVisitor; aam_uuid=19257032456276081894179762259447459237; bvid=1701751; cif_number=1701751; QSI_CT={"Bank Login":13,"account summary":17,"account details":10,"download transactions csv":20}; QSI_HistorySession=https%3A%2F%2Fsecurebanking.ally.com%2F%23%2Flogin~1449091296730%7Chttps%3A%2F%2Fsecurebanking.ally.com%2F%23%2Ferror%2Fpage-not-found~1449091300085%7Chttps%3A%2F%2Fsecurebanking.ally.com%2F%23%2Flogin~1449091441667%7Chttps%3A%2F%2Fwww.ally.com%2F%3Fcontext%3Dbank~1449091563708%7Chttps%3A%2F%2Fsecurebanking.ally.com%2F%23%2Flogin~1449091615400; mbox=PC#1448469329289-532900.28_48#1450301224|profile#+cif_number%3A1701751+autoCustomer%3Afalse+bankCustomer%3Atrue+eligibilityCodeExpires%3A2015-12-31%20000000%20UTC+eligibilityCode%3A1099INT2014%20AOBPilot0914%20%20BILLPAY101515+custId%3A1701751#1480195563|session#1449090167874-969362#1449093484|check#true#1449091684;' +
            'idp-jsessionid=-I5ktj7wrXTQmGCZBn_-C8Y6KHVKozEw2VRSoyrRf0RR1nl4C2lD!2018951346; ' + 'TLTSID=90C4CD46B550E5B50A8E27D479A96515; deviceTokenCookieRSAPvtBlock=PMV62BccM0vS3c3Aqz4tPhHwqF7i97SRvKHcyDmNYsKZLRa2%2FZGja93NS7kGxSjBTsVV6faLI3OlfvXqj%2F6BC%2By59SlA%3D%3D; s_vi=[CS]v1|2B2AF1AA05079532-40000110400027BD[CE]; jeffersonLastActiveTime=1449093448250; s_pers=%20ttcdaop27%3D1480196315361%7C1480196315361%3B%20gpv_e5%3Dno%2520value%7C1449095243421%3B%20s_fid%3D035D81B7DC97108D-2304B59E4BD1D9C9%7C1512251848316%3B%20s_nr%3D1449093448323-Repeat%7C1451685448323%3B%20gpv_pn_c60%3Dno%2520value%7C1449095248324%3B; s_sess=%20s_cc%3Dtrue%3B%20s_sq%3Dgmacmortgageallybankprod%252Callyglobal%253D%252526pid%25253Dhttps%2525253A%2525252F%2525252Fsecurebanking.ally.com%2525252F%25252523%2525252Flogin%252526oid%25253DContinue%252526oidt%25253D3%252526ot%25253DSUBMIT%3B'
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

