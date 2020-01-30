const express = require("express");
const router = express.Router();
const Category = require("../../models/admin/category");

/*
 * GET category index route
 */
router.get("/", async (req, res) => {
    res.render("admin/categories/categories");
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
    let categories = new Category({
        categories: req.body.category
    });
    categories.save((err, newCategory) => {
        if (err) {
            res.render("admin/categories/add_category", {
                categories: categories,
                errorMessage: "Error Creating Category"
            });
        }else {
            res.redirect("admin/categories");
        }
    });
});

/*
 * GET edit_category route
 */
router.get("/", async (req, res) => {
    res.send("Category");
});

module.exports = router;