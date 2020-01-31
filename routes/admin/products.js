const express = require("express");
const router = express.Router();
const Product = require("../../models/admin/product");
const Category = require("../../models/admin/category");

/*
 * GET product index route
 */
router.get("/", async (req, res) => {
    res.render("admin/products/product", {
        products: new Product()
    })
});

/*
 * GET add_product route
 */
router.get("/add_product", async (req, res) => {
    try {
        let categories = await Category.find({});
        let products = new Product();
        res.render("admin/products/add_product", {
            categories: categories,
            products: products
        });
    }catch (e) {
        res.redirect("admin/products");
    }
});

/*
 * POST add_product route
 */
router.post("/add_product", async (req, res) => {

});

module.exports = router;