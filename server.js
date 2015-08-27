var http = require("http");
var express = require("express");
var app = express();
app.use(express.bodyParser()); // support json encoded bodies

var MongoClient = require("mongodb").MongoClient;
var assert = require("assert");
var ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/test";

var insertDocument = function(db, callback) {
    db.collection('restaurants').insertOne({
        "address": {
            "street": "2 Avenue",
            "zipcode": "10075",
            "building": "1480",
            "coord": [-73.9557413, 40.7720266],
        },
        "borough": "Manhattan",
        "cuisine": "Italian",
        "grades": [{
            "date": new Date("2014-10-01T00:00:00Z"),
            "grade": "A",
            "score": 11
        }, {
            "date": new Date("2014-01-16T00:00:00Z"),
            "grade": "B",
            "score": 17
        }],
        "name": "Vella",
        "restaurant_id": "41704620"
    }, function(err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the restaurants collection.");
        callback(result);
    });
};

var findRestaurants = function(db, callback) {
    var result = [];
   var cursor =db.collection('restaurants').find({ "address.zipcode": "10075" });
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
        });
    });
    res.send('Completed');
};

var getRecord = function(req, res) {
    console.log("received!", req.url, req.headers, req.body);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        findRestaurants(db, function(result) {
            db.close();
            console.log("done", result);
            res.send(result);
        });
    });
};

app.post("/api/dbCreate", createRecord);
app.get("/api/db", getRecord);


var server = app.listen(2323, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Node.js Listening on port: %s:%s", host, port);
});

