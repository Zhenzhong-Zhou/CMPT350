const express = require("express");
const router = express.Router();
const Category = require("../../models/admin/category");

/*
 * GET category index route
 */
router.get("/", async (req, res) => {
   res.send("Category");
});

/*
 * GET add_category route
 */
router.get("/", async (req, res) => {
    res.send("Category");
});

/*
 * POST add_category route
 */
router.get("/", async (req, res) => {
    res.send("Category");
});

/*
 * GET edit_category route
 */
router.get("/", async (req, res) => {
    res.send("Category");
});

module.exports = router;