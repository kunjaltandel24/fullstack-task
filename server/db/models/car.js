const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const car = new Schema({
    price: {
        type: Number,
        required: true
    },
    sku: {
        type: String,
        required: true,
        unique: true
    },
    quantity: {
        type: Number,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Car', car, 'car_inventories');
