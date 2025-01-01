const express = require("express")
const router = express.Router()

/* GET home page. */
router.get("/", function (req, res, next) {
  res.json({ message: "General server is running!" })
});

module.exports = router
