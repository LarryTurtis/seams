var MongoClient = require("mongodb").MongoClient,
    assert = require("assert"),
    ObjectId = require("mongodb").ObjectID,
    url = "mongodb://localhost:27017/test";

var Product = require('./models/product');

exports.createRecord = function(req, res) {
    var product = new Product();
    product.id = req.body.id;
    product.name = req.body.name;
    product.description = req.body.description;
    product.price = req.body.price;
    product.size = req.body.size;
    product.image = req.body.image;
    product.save(function(err, product) {
        if (err) {
            console.log("Error in saving to the database." + err);
            res.status(500).send("Could not save to database.");
        }
        res.send(product);
    });
};

exports.getRecord = function(req, res) {
    Product.find({}, function(err, products) {
        if (err) {
            console.log("Could not get products. " + err);
            res.status(500).send("Could not get products");
        }
        res.send(products);
    })
};

exports.deleteRecord = function(req, res) {
    console.log(req.body)
    var id = req.body.id;
    Product.find({
        id: id
    }).remove(function() {
        res.send('Deleted!');
    });

}
