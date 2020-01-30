const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");

/*
 * GET page index route
 */
router.get("/", async (req, res) => {
    try {
        const pages = await Page.find({}).sort({sorting: 1}).exec();
        res.render("admin/page", {
            pages: pages
        });
    }catch (e) {
        res.render("admin");
    }
});

/*
 * GET add_page route
 */
router.get("/add_page", (req, res) => {
    res.render("admin/add_page", {pages: new Page()});
});

/*
 * POST add_page route
 */
router.post("/add_page", async (req, res) => {
    let page = new Page({
        title: req.body.title,
        slug: req.body.slug,
        content: req.body.content,
        sorting: 0
    });
    try {
        const newPage = await page.save();
        // res.redirect(`admin/${newPage.id}`);
        res.redirect("/admin/pages");
    }catch (e) {
        res.render("admin/page", {
            page: page,
            errorMessage: "Error Creating Page"
        })
    }
});

/*
 * POST page index route
 */
router.post("/reorder_pages", async (req, res) => {
    console.log(req.body);
    let ids = req.body['id[]'];
    let count = 0;
    for (let i = 0; i < ids.length; i++) {
        let id = ids[i];
        count++;
        (function (count) {
            Page.findById(id, (err, page) => {
                page.sorting = count;
                page.save(err => {
                    if (err) return console.log(err);
                });
            });
        })(count);
    }
});

module.exports = router;