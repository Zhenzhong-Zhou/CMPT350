const express = require("express");
const router = express.Router();
const Product = require("../../models/admin/product");
const Category = require("../../models/admin/category");
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];

/*
 * GET product index route
 */
router.get("/", async (req, res) => {
    let query = Product.find();
    if (req.query.product != null && req.query.product !== "") {
        query = query.regex("product", new RegExp(req.query.product, "i"))
    }
    try {
        const products = await query.exec();
        res.render("admin/products/product", {
            products: products,
            searchOptions: req.query
        })
    }catch (e) {
        res.redirect("admin/products");
    }
});

/*
 * GET add_product route
 */
router.get("/add_product", async (req, res) => {
    await renderNewPage(res, new Product());
});

/*
 * POST add_product route
 */
router.post("/add_product", async (req, res) => {
    const product = new Product({
        product: req.body.product,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description
    });
    saveImage(product, req.body.cover);
    try {
        await product.save();
        res.redirect("/admin/products");
    }catch (e) {
        await renderNewPage(res, product, true);
    }
});

async function renderNewPage(res, products, hasError = false) {
    try {
        const categories = await Category.find({});
        const params = {
            categories: categories,
            products: products
        };
        if (hasError) params.errorMessage = "Error Creating Product";
        res.render("admin/products/add_product", params);
    }catch (e) {
        res.redirect("admin/products");
    }
}

function saveImage(product, imageEncode) {
    if (imageEncode == null) return;
    const image = JSON.parse(imageEncode);
    if (image != null && imageMimeTypes.includes(image.type)) {
        product.productImage = new Buffer.from(image.data, 'base64');
        product.coverImageType = image.type;
    }
}

module.exports = router;