var MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    ObjectId = require("mongodb").ObjectID,
    url = "mongodb://localhost:27017/test";

var Product = require('./models/product');


var insertDocument = function(db, callback, data) {
    db.collection('fruits').insertOne(data, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

var findDocument = function(db, callback, filter) {
    var result = [];
    var cursor = db.collection('products').find(filter);
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
    var product = new Product();
    product.id = req.body.id;
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.size = req.body.size;
    product.image = req.body.image;
    product.save(function(err, product){
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        }
        res.send(product);
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
