const express = require("express");
const lecture = require("../controller/lecture.controller");
const router = express.Router();
router.post("/login", lecture.login);
router.post("/register", lecture.register);
// std answet

module.exports = router;
