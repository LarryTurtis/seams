var mongoose = require('mongoose');

module.exports = mongoose.model('Product', {
    id: String,
    image: String,
    name: String,
    description: String,
    price: Number,
    size: String
});
