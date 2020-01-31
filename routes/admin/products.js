const express = require("express");
const router = express.Router();
const Product = require("../../models/admin/product");
const Category = require("../../models/admin/category");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const uploadPath = path.join("public", Product.coverImageBasePath);
const imageMimeTypes = ["image/jpeg", "image/png", "images/gif"];
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype));
    }
});

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
router.post("/add_product", upload.single("cover"), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null;
    const product = new Product({
        product: req.body.product,
        category: req.body.category,
        price: req.body.price,
        productImageName: fileName,
        description: req.body.description
    });
    try {
        await product.save();
        res.redirect("/admin/products");
    }catch (e) {
        if (product.productImageName != null) {
            removeProductCover(product.productImageName);
        }
        await renderNewPage(res, product, true);
    }
});

function removeProductCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err);
    })
}

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

module.exports = router;