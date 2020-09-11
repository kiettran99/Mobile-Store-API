const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const productSchema = mongoose.Schema({
    name: String,
    imageUrl: String,
    price: Number,
    description: String,
    manufacturer: String,
    category: String,
    conditionProduct: String,
    quantity: Number,
    likes: [{
        user: {
            type: ObjectId,
            ref: 'User'
        }
    }],
    comments: [{
        user: {
            type: ObjectId,
            ref: 'User'
        },
        text: {
            type: String
        },
        name: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timeStamps: true
});

module.exports = mongoose.model("Product", productSchema);