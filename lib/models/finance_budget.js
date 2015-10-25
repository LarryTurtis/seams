var mongoose = require('mongoose');

module.exports = mongoose.model('Finance_Budget', {
    category: {type: String, unique: true, required: true},
    amount: Number
});
