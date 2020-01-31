const mongoose = require('mongoose');

// Product Schema
const productSchema = mongoose.Schema({
    product: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    productImageName: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    }
});

module.exports = mongoose.model("Product", productSchema);