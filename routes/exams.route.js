const express = require("express");
const exam = require("../controller/exam.controller");
const authStudent = require("../middleware/auth.middleware");
const authLecture = require("../middleware/lacture.middleware");
const router = express.Router();
router.get("/question/:id", authLecture, exam.getQuestionLacture);
router.get("/score/:id", authStudent, exam.getScore);
router.get("/getOne/:id", exam.getOneQuestion);
// router.get("/:cId", authStudent, exam.getQuestions);
router.get("/get-count", authStudent, exam.getAnswerdQuestionNumber);
router.post("/question", authLecture, exam.add);
router.put("/student/answer", authStudent, exam.answer);
router.put("/unactivate/:id", authLecture, exam.unactivateQuestion);
router.put("/delete/:id", authLecture, exam.deleteQuestion);
router.get("/:Cid", authStudent, exam.getOne);

// std answet getScore

module.exports = router;
