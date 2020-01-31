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
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    productImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Category"
    }
});

productSchema.virtual("coverImagePath").get(function () {
    if (this.productImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType};charset=utf-8;base64,${this.productImage.toString('base64')}`
    }
});

module.exports = mongoose.model("Product", productSchema);