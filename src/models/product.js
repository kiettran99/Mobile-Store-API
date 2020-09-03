const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: String,
    imageUrl: String,
    price: Number,
    description: String,
    manufacturer: String,
    category: String,
    conditionProduct: String,
    quantity: Number 
});

module.exports = mongoose.model("Product", productSchema);