const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");

/*
 * GET page index route
 */
router.get("/", async (req, res) => {
    try {
        const pages = await Page.find({}).sort({sorting: 1}).exec();
        res.render("admin/pages/page", {
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
    res.render("admin/pages/add_page", {pages: new Page()});
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
        await page.save();
        res.redirect("/admin/pages");
    }catch (e) {
        res.render("admin/pages/page", {
            page: page,
            errorMessage: "Error Creating Page: must fill all info"
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
router.get("/view_page/:id", async (req, res) => {
    try {
        const pages = await Page.findById(req.params.id).exec();
        res.render("admin/pages/view_page", {pages: pages})
    }catch (e) {
        res.redirect("/");
    }
});

/*
 * GET edit_page route
 */
router.get("/edit_page/:id", async (req, res) => {
    Page.findById(req.params.id, (err, page) => {
        if (err) {
            return console.log(err);
        }else {
            res.render("admin/pages/edit_page", {
                pages: page
            });
        }
    });
});

/*
 * PUT edit_page route
 */
router.put("/edit_page/:id", async (req, res) => {
    let page;
    try {
        page = await Page.findById(req.params.id);
        page.title = req.body.title;
        page.slug = req.body.slug;
        page.content = req.body.content;
        await page.save();
        res.redirect("/admin/pages");
    }catch (e) {
        if (page != null) {
            res.render("admin/pages/page", {
                page: page,
                errorMessage: "Error Editing Page"
            });
        }else {
            res.redirect("/");
        }
    }
});

/*
 * DELETE delete_page route
 */
router.delete("/:id", async (req, res) => {
    let page;
    try {
        page = await Page.findById(req.params.id);
        await page.remove();
        res.redirect("/admin/pages");
    }catch (e) {
        if (page == null) {
            res.redirect("/");
        }else {
            res.redirect("/admin/pages");
        }
    }
});

module.exports = router;