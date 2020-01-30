const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("routes/index.js");
});

module.exports = router;