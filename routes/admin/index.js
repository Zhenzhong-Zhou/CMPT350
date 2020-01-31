const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");
const Category = require("../../models/admin/category");
const Product = require("../../models/admin/product");

/*
 * GET admin index route
 */
router.get("/", async (req, res) => {
    let pages;
    let categories;
    let products;
    try {
        pages = await Page.find({}).sort({sorting: 1}).limit(5).exec();
        categories = await Category.find({}).limit(5);
        products = await Product.find({}).sort({createAT: "desc"}).limit(5).exec();
        res.render("admin/index", {
            pages: pages,
            categories: categories,
            products: products
        });
    }catch (e) {
        products = [];
        res.render("admin", {products: products});
    }
});

module.exports = router;