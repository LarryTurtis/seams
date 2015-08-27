var http = require("http");
var express = require("express");
var app = express();
app.use(express.bodyParser()); // support json encoded bodies

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/test";

var insertDocument = function(db, callback, data) {
    db.collection('restaurants').insertOne(data, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback(result);
    });
};

var findDocument = function(db, callback, filter) {
    var result = [];
   var cursor =db.collection('restaurants').find(filter);
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

app.post("/api/dbCreate", createRecord);
app.post("/api/db", getRecord);


var server = app.listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});

