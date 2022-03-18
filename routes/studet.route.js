const express = require("express");
const student = require("../controller/studet.controller");
const authAdmin = require("../middleware/admin.middleware");

const router = express.Router();
router.post("/login", student.login);
router.post("/register", authAdmin, student.register);
router.get("/", student.get);
// router.post("/", student.add);
router.get("/:id", student.getOne);

module.exports = router;
