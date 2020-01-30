const express = require("express");
const router = express.Router();

/*
 * GET pages index
 */
router.get("/pages", (req, res) => {
    res.render("admin/index");
});

/*
 * GET add_page
 */
router.get("/a", (req, res) => {
    res.render("admin/index");
});

module.exports = router;