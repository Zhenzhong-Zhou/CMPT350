const express = require("express");
const router = express.Router();
const Category = require("../../models/admin/category");

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
    res.send("View Category: " + req.params.id);
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
    res.send("PUT Edit Category: " + req.params.id);
});

/*
 * DELETE delete_category route
 */
router.delete("/:id", async (req, res) => {
    res.send("Delete Category: " + req.params.id);
});

module.exports = router;