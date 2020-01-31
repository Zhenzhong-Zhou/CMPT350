const mongoose = require('mongoose');
const path = require("path");
const coverImageBasePath = "upload/productCovers";

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

productSchema.virtual("coverImagePath").get(function () {
    if (this.productImageName != null) {
        return path.join("/", coverImageBasePath, this.productImageName);
    }
});

module.exports = mongoose.model("Product", productSchema);
module.exports.coverImageBasePath = coverImageBasePath;