var mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    id: String,
    image: String,
    name: String,
    price: Number,
    size: Number
});
