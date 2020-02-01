const express = require("express");
const router = express.Router();
const Category = require("../../models/category");
const Product = require("../../models/product");

/*
 * GET category index route
 */
router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.category != null && req.query.category !== "") {
        searchOptions.category = new RegExp(req.query.category, "i");
    }
    try {
        const categories = await Category.find(searchOptions).exec();
        res.render("admin/categories/category", {
            categories: categories,
            searchOptions: req.query
        });
    }catch (e) {
        res.render("admin");
    }
});

/*
 * GET add_category route
 */
router.get("/add_category", async (req, res) => {
    res.render("admin/categories/add_category", {categories: new Category()});
});

/*
 * POST add_category route
 */
router.post("/add_category", async (req, res) => {
    let category = new Category({
        category: req.body.category
    });
    try {
        await category.save();
        res.redirect("/admin/categories");
    }catch (e) {
        res.render("admin/categories/category", {
            category: category,
            errorMessage: "Error Creating Category"
        });
    }
});

/*
 * GET view_category route
 */
router.get("/view_category/:id", async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        const products = await Product.find({category: category.id}).limit(5).exec();
        res.render("admin/categories/view_category", {
            category: category,
            productsByCategory: products
        })
    }catch (e) {
        console.log(e);
        res.redirect("/");
    }
});

/*
 * GET edit_category route
 */
router.get("/edit_category/:id", async (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if (err) {
            return console.log(err);
        }else {
            res.render("admin/categories/edit_category", {
                categories: category
            });
        }
    });
});

/*
 * PUT edit_category route
 */
router.put("/edit_category/:id", async (req, res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        category.category = req.body.category;
        await category.save();
        res.redirect("/admin/categories");
    }catch (e) {
        if (category == null) {
            res.redirect("/admin/categories");
        }else {
            res.render("admin/categories/category", {
                category: category,
                errorMessage: "Error Editing Category"
            })
        }
    }
});

/*
 * DELETE delete_category route
 */
router.delete("/:id", async (req, res) => {
    let category;
    try {
        category = await Category.findById(req.params.id);
        category.category = req.body.category;
        await category.remove();
        res.redirect("/admin/categories");
    }catch (e) {
        if (category == null) {
            res.redirect("/admin/categories");
        }else {
            res.redirect("/admin/categories");
        }
    }
});

module.exports = router;