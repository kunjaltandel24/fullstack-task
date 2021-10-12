const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const sale = new Schema({
    car: {
        type: Schema.Types.ObjectId,
        ref: 'Car',
        required: true
    },
    saleDate: {
        type: Date,
        required: true
    },
    soldPrice: {
        type: Number,
        required: true
    },
    buyerName: {
        type: String,
        required: true
    },
    buyerPhone: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Sale', sale, 'sale_transactions');
