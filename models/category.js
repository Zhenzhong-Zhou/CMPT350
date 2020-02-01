const mongoose = require('mongoose');
const Product = require("./product");

// Category Schema
const categorySchema = mongoose.Schema({
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String
    }
});

categorySchema.pre("remove", function (next) {
    Product.find({category: this.id}, (err, categories) => {
        if (err) {
            next(err);
        }else if (categories.length > 0) {
            next(new Error("This category has products still!!!!"));
        }else {
            next();
        }
    })
});

module.exports = mongoose.model("Category", categorySchema);