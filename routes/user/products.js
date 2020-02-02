const express = require("express");
const router = express.Router();
const Product = require("../../models/product");

/*
 * GET all products
 */
router.get("/", async (req, res) => {
    try {
        const products = await Product.findById(req.params.id).populate("category").exec();
        res.render("user/products/product", {
            title: "All Products",
            products: products
        });
    }catch (e) {
        res.redirect("/user/products");
    }
    // Product.find((err, products) => {
    //     if (err) console.log(err);
    //     res.render("/user/products/product", {
    //         title: "All Products",
    //         products: products
    //     });
    // });
});


module.exports = router;