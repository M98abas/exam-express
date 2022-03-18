const express = require("express");
const lecture = require("../controller/lecture.controller");
const authAdmin = require("../middleware/admin.middleware");

const router = express.Router();
router.post("/login", lecture.login);
router.post("/register", authAdmin, lecture.register);
router.get("/", authAdmin, lecture.get);

// std answet

module.exports = router;
