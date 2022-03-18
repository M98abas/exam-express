const express = require("express");
const admin = require("../controller/admin.controller");
const router = express.Router();
router.post("/login", admin.login);
router.post("/register", admin.register);
// std answet

module.exports = router;
