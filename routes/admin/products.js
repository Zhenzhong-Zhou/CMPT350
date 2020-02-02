const express = require("express");
const router = express.Router();
const Product = require("../../models/product");
const Category = require("../../models/category");
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
        slug: req.body.slug,
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

/*
 * GET view_product route
 */
router.get("/view_product/:id", async (req, res) => {
    try {
        const products = await Product.findById(req.params.id).populate("category").exec();
        res.render("admin/products/view_product", {products: products})
    }catch (e) {
        res.redirect("/admin/products");
    }
});

/*
 * GET edit_product route
 */
router.get("/edit_product/:id", async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        await renderEditPage(res, product);
    }catch (e) {
        res.redirect("/admin/products");
    }

});

/*
 * PUT edit_product route
 */
router.put("/edit_product/:id", async (req, res) => {
    let product;
    try {
        product = await Product.findById(req.params.id);
        product.product = req.body.product;
        product.category = req.body.category;
        product.price = req.body.price;
        product.description = req.body.description;
        if (req.body.cover != null && req.body.cover !== "") {
            saveImage(product, req.body.cover)
        }
        await product.save();
        res.redirect("/admin/products/");
    }catch (e) {
        if (product != null) {
            await renderNewPage(res, product, true);
        }else {
            res.redirect("/admin/products");
        }
    }
});

/*
 * DELETE delete_product route
 */
router.delete("/:id", async (req, res) => {
    let  product;
    try {
        product = await Product.findById(req.params.id);
        await product.remove();
        res.redirect("/admin/products");
    }catch (e) {
        if (product != null) {
            res.render("/", {
                product: product,
                errorMessage: "Could not remove product"
            });
        }else {
            res.redirect("/");
        }
    }
});

function saveImage(product, imageEncode) {
    if (imageEncode == null) return;
    const image = JSON.parse(imageEncode);
    if (image != null && imageMimeTypes.includes(image.type)) {
        product.productImage = new Buffer.from(image.data, 'base64');
        product.coverImageType = image.type;
    }
}

async function renderNewPage(res, products, hasError = false) {
    await renderFormPage(res, products, "add_product", hasError);
}

async function renderEditPage(res, products, hasError = false) {
    await renderFormPage(res, products, "edit_product", hasError);
}

async function renderFormPage(res, products, form, hasError = false) {
    try {
        const categories = await Category.find({});
        const params = {
            categories: categories,
            products: products
        };
        if (hasError) {
            if (form === "edit_product") {
                params.errorMessage = "Error Editing Product";
            }else {
                params.errorMessage = "Error Adding Product";
            }
        }
        res.render(`admin/products/${form}`, params);
    }catch (e) {
        res.redirect("admin/products");
    }
}

module.exports = router;