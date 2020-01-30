const express = require("express");
const router = express.Router();
const Page = require("../../models/admin/page");
/*
 * GET pages index route
 */
router.get("/", (req, res) => {
    res.render("admin/page");
});

/*
 * GET add_page route
 */
router.get("/add_page", (req, res) => {
    res.render("admin/add_page", {
        pages: new Page()
    });
});

/*
 * POST add_page route
 */
router.post("/", (req, res) => {
    res.send("Create a page");
});

module.exports = router;