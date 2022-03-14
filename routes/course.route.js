const express = require("express");
const course = require("../controller/course.controller");
const authLecture = require("../middleware/lacture.middleware");
const authStudent = require("../middleware/auth.middleware");
const router = express.Router();
router.get("/", course.get);
router.get("/courses", course.getField);
router.get("/allcourses", authLecture, course.getForLacture);
router.get("/all", authLecture, course.getAllWithStudent);
router.post("/", course.add);
router.put("/delete/:id", course.deleteOne);
router.get("/getOne/:id", authStudent, course.getOneAndSet);
router.get("/:id", course.getOne);

router.put("/:id", course.update);

// std answet

module.exports = router;
