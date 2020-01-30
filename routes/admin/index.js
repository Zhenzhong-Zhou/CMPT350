const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");

/*
 * GET admin index route
 */
router.get("/", async (req, res) => {
    try {
        const pages = await Page.find({}).sort({sorting: 1}).exec();
        res.render("admin/index", {
            pages: pages
        });
    }catch (e) {
        res.render("admin");
    }
});

module.exports = router;