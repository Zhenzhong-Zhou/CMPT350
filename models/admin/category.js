const mongoose = require('mongoose');

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

module.exports = mongoose.model("Category", categorySchema);