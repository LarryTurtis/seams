var MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    ObjectId = require("mongodb").ObjectID,
    url = "mongodb://localhost:27017/test";

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

exports.createRecord = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertDocument(db, function(result) {
            db.close();
            res.send(req.body);
        }, req.body);
    });
};

exports.getRecord = function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findDocument(db, function(result) {
            db.close();
            res.send(result);
        }, req.body);
    });
};
