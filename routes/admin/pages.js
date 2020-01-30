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
        res.redirect(`admin/${newPage.id}`);
        // res.redirect("/admin/pages");
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

/*
 * GET view_page route
 */
router.get("/view_page/:id", (req, res) => {
    res.send("View Page: " + req.params.id);
});

/*
 * GET edit_page route
 */
router.get("/edit_page/:id", async (req, res) => {
    try {
        const pages = Page.findById(req.params.id);
        res.render("admin/edit_page", {pages: pages});
    }catch (e) {
        res.render("admin/pages");
    }
});

/*
 * PUT update_page route
 */
router.put("/update_page/:id", async (req, res) => {
    let page;
    try {
        page = await Page.findById(req.params.id);
        page.title = req.body.title;
        page.slug = req.body.slug;
        page.content = req.body.content;
        await page.save();
        res.redirect(`/admin/${page.id}`);
    }catch (e) {
        if (page == null) {
            res.redirect("admin");
        }else {
            res.render("admin/edit_page", {
                page: page,
                errorMessage: "Error Updating Page"
            })
        }
    }
});

/*
 * DELETE delete_page route
 */
router.delete("/:id", (req, res) => {
    res.send("Delete Page: " + req.params.id);
});



module.exports = router;