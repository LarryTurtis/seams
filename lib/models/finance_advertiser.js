var mongoose = require('mongoose');

module.exports = mongoose.model('Finance_Advertiser', {
    name: {type: String, unique: true},
    category: String
});
