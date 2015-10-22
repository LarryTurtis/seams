var mongoose = require('mongoose');

module.exports = mongoose.model('Finance_Advertiser', {
    name: String,
    category: String
});
