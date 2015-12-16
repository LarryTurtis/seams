var mongoose = require('mongoose');

module.exports = mongoose.model('Finance_Vendor', {
    name: {type: String, unique: true},
    category: String
});
