var http = require("http");
var express = require("express");

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/test";

var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({
    storage: storage
})

var app = express();

bodyParser = require("body-parser")
app.use(bodyParser.json())
    .use(bodyParser.urlencoded())


var insertDocument = function(db, callback, data) {
    db.collection('fruits').insertOne(data, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the fruits collection.");
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
    console.log("received!", req.url, req.headers, req.body);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        insertDocument(db, function() {
            db.close();
        }, req.body);
    });
    res.send('Completed');
};

var getRecord = function(req, res) {
    console.log("received!", req.url, req.headers, req.body);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        findDocument(db, function(result) {
            db.close();
            console.log("done", result);
            res.send(result);
        }, req.body);
    });
};

app.use(express.static(__dirname));

app.post("/api/dbCreate", createRecord);
app.post("/api/db", getRecord);
app.post("/api/upload", upload.single('avatar'), function(req, res, next) {
    res.send(req.file);
});

var server = http.createServer(app).listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});
