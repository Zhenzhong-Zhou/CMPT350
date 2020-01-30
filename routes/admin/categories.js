const express = require("express");
const router = express.Router();
const Category = require("../../models/admin/category");

/*
 * GET category index route
 */
router.get("/", async (req, res) => {
    res.render("admin/categories/category");
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
 * GET edit_category route
 */
router.get("/", async (req, res) => {
    res.send("Category");
});

module.exports = router;