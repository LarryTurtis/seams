var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    date: 'date',
    modified: 'date',
    amount: 'number',
    description: 'string',
    account: 'string',
    reference: 'string',
    category: 'string',
    subCategory: 'string'
});
schema.index({
    date: 1,
    amount: 1,
    description: 1,
    account: 1,
    reference: 1,
    category: 1,
    subCategory: 1
}, {
    unique: true
})

module.exports = mongoose.model('Finance_Transaction', schema);
