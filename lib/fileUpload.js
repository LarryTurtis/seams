var express = require("express");
var multer = require("multer");

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, req.headers.destination || './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
});

var limits = {
    fields: 100,
    fileSize: 5000000,
    files: 10,
    parts: 110
}

var fileFilter = function(req, file, cb) {
    if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" && file.mimetype != "image/gif") {
        cb(null, false)
    } else {
    	cb(null, true);
    }
};

var upload = multer({
    storage: storage,
    limits: limits,
    fileFilter: fileFilter
});

module.exports = upload;
