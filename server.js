var http = require("http"),
  express = require("express"),
  MongoClient = require("mongodb").MongoClient,
  assert = require("assert"),
  ObjectId = require("mongodb").ObjectID,
  upload = require('./fileUpload.js'),
  url = "mongodb://localhost:27017/test",
  bodyParser = require("body-parser"),
  app = express();

app.use(bodyParser.json())
  .use(bodyParser.urlencoded({ extended: true }))
  .use(express.static(__dirname));


var insertDocument = function(db, callback, data) {
    db.collection('fruits').insertOne(data, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

var findDocument = function(db, callback, filter) {
    var result = [];
    var cursor = db.collection('fruits').find(filter);
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            result.push(doc);
        } else {
            callback(result);
        }
    });
};

var createRecord = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function() {
            db.close();
        }, req.body);
    });
    res.send('Completed');
};

var getRecord = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findDocument(db, function(result) {
            db.close();
            res.send(result);
        }, req.body);
    });
};

app.post("/api/dbCreate", createRecord);
app.post("/api/db", getRecord);
app.post("/api/upload", upload.single('avatar'), function(req, res) {
    res.send(req.file);
});

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});
