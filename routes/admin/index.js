const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");
const Product = require("../../models/admin/product");

/*
 * GET admin index route
 */
router.get("/", async (req, res) => {
    let pages;
    let products;
    try {
        pages = await Page.find({}).sort({sorting: 1}).exec();
        products = await Product.find({}).sort({createAT: "desc"}).limit(10).exec();
        res.render("admin/index", {
            pages: pages,
            products: products
        });
    }catch (e) {
        products = [];
        res.render("admin", {products: products});
    }
});

module.exports = router;