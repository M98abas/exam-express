const db = require("../services/db");
const { okRes, errRes } = require("../utils/util.services");
const { validate } = require("validate.js");

/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */

async function getQuestions(req, res) {
  // get lecture from the miidleware
  // let istractors = req.istractors;
  // console.log(istractors);
  if (req.params.cId != "NaN") {
    // console.log(req.params);
    const courseId = parseInt(req.params.cId);
    // const courseId = parseInt(req.params.cId)
    // console.log(courseId);
    try {
      const rows = await db.query(
        `select * from question where courseId='${courseId}' AND active=true ORDER BY RAND() LIMIT 1;`
      );
      // console.log(rows);

      if (!rows) return errRes(res, "Course not found");
      return okRes(res, { rows });
    } catch (err) {
      return errRes(res, err);
    }
  }
}
async function getQuestionLacture(req, res) {
  // get lecture
  let lecture = req.lecture;
  let idCourse = parseInt(req.params.id);
  // console.log(req.params);
  if (idCourse) {
    // try {
    // select * from question INNER join courses on courses.Cid = question.id where question.courseId=1 AND question.lectureId=38
    const sql = `select * from question INNER join courses on courses.Cid =question.courseId where question.courseId= ${idCourse} AND question.lectureId='${lecture[0].id}' and question.active=1 `;
    const questions = await db.query(sql);
    // console.log(questions);
    // check if the Questions exists
    const sqlA = `select question,answer.id,answer.questionID,answer.aswers as answers from question inner join answer on answer.questionID =question.id INNER join courses on courses.Cid =question.courseId where question.courseId = ${idCourse} AND question.lectureId='${lecture[0].id}' and question.active=1 `;
    const answers = await db.query(sqlA);

    if (!questions) return errRes(res, "Questions not found");
    return okRes(res, { questions, answers });
    // } catch (error) {
    //   return errRes(res, "Error Can't fetch questions");
    // }
  }
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getOne(req, res) {
  // get id
  try {
    // console.log(req.params);
    let istractors = req.istractors;
    const id = parseInt(req.params.Cid);
    // console.log(id);
    // console.log(req.params);
    if (id) {
      const sql2 = `select id, question from question where courseId=${id} AND active=1 And Qactive=1 ORDER BY RAND() LIMIT 1`;
      let question = await db.query(sql2);
      // console.log("Q", question);
      const sql = `select question.id as Qid,question.question,answer.id, answer.aswers,question.truth_answer from question inner join answer on answer.questionId = question.id where question.id=${question[0].id} AND active=1 And Qactive=1 ORDER BY RAND()`;
      let answers;
      // s
      // try {
      answers = await db.query(sql);

      // console.log("this ", answers);
      if (answers[0].Qid)
        await db.query(
          `insert into questionIstractors(studentId,questionId) values(${istractors[0].id},${answers[0].Qid})`
        );
      // else
      let field = await db.query(`select name from courses where Cid=${id}`);

      return okRes(res, { answers, field });
    }
  } catch {
    return errRes(res, "Error");
  }
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
async function getAnswerdQuestionNumber(req, res) {
  const istractors = req.istractors;
  try {
    let answerd = await db.query(
      `select COUNT(*) from questionIstractors where studentId=${istractors.id}`
    );
    // console.log(answerd);
    return okRes(res, { answerd });
  } catch {
    return errRes(res, "Not exists");
  }
}
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {This on to get all question from the db depdance on id that came from user}
 * @returns
 */
async function getOneQuestion(req, res) {
  const id = parseInt(req.params.id);

  if (id) {
    // console.log(id);
    const sql = `select question.truth_answer,answer.id,answer.aswers,question.question from question inner join answer on question.id = answer.questionID where question.id=${id} AND active=1`;
    // s
    // try {
    let questionAnswer = await db.query(sql);
    // console.log(questionAnswer);
    // console.log(questionAnswer);
    if (questionAnswer) return okRes(res, { questionAnswer });
    return errRes(res, "Empty Data");
  }
  return;
  // return errRes(res, "There is an Error with id");
}

/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function add(req, res) {
  // get body
  const body = req.body;
  // let istractors = req.istractors;

  let must = true;
  // console.log(body);
  // validated it
  let notValid = validate(body, {
    question: { presence: must, type: "string" },
    truthAnswer: { presence: must, type: "string" },
  });
  if (notValid) return errRes(res, "The data you send is not valid");
  let question;
  try {
  // get lecture
  let lecture = req.lecture;
  // console.log(lecture);
  // console.log(body.courseId);
  sql = `insert into question(id,question,truth_answer,courseId,lectureId) values ('${body.id}','${body.question}','${body.truthAnswer}',${body.courseValueId},${lecture[0].id})`;
  question = await db.query(sql);
  // console.log(question);
  let answer = body.answers;
  for (let i = 0; i < answer.length; i++) {
    // console.log(answer[i]);
    sql = `insert into answer(aswers,questionID) values ('${answer[i]}','${body.id}')`;
    anserIn = await db.query(sql);
  }
  return okRes(res, { question });
  } catch {
    return errRes(res, "Error in the insert query");
  }
}
/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function answer(req, res) {
  const body = req.body;
  //get ist ,score
  // console.log("Bos", body);
  // validated it
  try {
    let istractors = req.istractors;
    // console.log(body);
    let notValid = validate(body, {
      score: { presence: true, type: "string" },
    });
    // console.log(notValid);
    if (notValid) return errRes(res, "The data you send is not valid");
    let checkes = await db.query(
      `select * from istractor_courses where istractorId=${istractors[0].id} And coursesId=${body.courseId}`
    );
    // console.log("values", checkes.length != 0);
    if (checkes.length != 0) {
      await db.query(
        `update istractor_courses set score=${body.score} WHERE istractorId=${istractors[0].id} And coursesId=${body.courseId}`
      );
      return okRes(res, "Done");
    } else {
      await db.query(
        `insert into istractor_courses(istractorId,coursesId,score) values (${istractors[0].id},${body.courseId},${body.score})`
      );
      return okRes(res, "Done");
    }
  } catch {
    errRes(res, "There is an error occurred while updating the value");
  }
}

/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function unactivateQuestion(req, res) {
  const id = parseInt(req.params.id);

  if (id) {
    const sql = `update question set Qactive=NOT Qactive where id=${id}`;
    // s
    // try {
    let deleteOneQuestion = await db.query(sql);
    // console.log(deleteOneQuestion);
    if (deleteOneQuestion) return okRes(res, { deleteOneQuestion });
    return errRes(res, "Empty Data");
  }
  return;
}
/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function deleteQuestion(req, res) {
  const id = parseInt(req.params.id);
  // console.log(id);

  if (id) {
    const sql = `update question set active=0 where id=${id}`;
    // s
    // try {
    let deleteOneQuestion = await db.query(sql);
    // console.log(deleteOneQuestion);
    if (deleteOneQuestion) return okRes(res, { deleteOneQuestion });
    return errRes(res, "Empty Data");
  }
  return;
}
/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function getScore(req, res) {
  let istractors = req.istractors;
  let coursesId = parseInt(req.params.id);

  // console.log(req.params);
  // console.log(coursesId);
  if (coursesId) {
    let score = await db.query(
      `select * from istractor_courses where istractorId='${istractors[0].id}' and coursesId=${coursesId}`
    );
    // console.log(score);
    return okRes(res, { score });
  }
  return okRes(res, "NO");
  // console.log(score);
  // score = score[0];
}

module.exports = {
  getQuestions,
  getScore,
  add,
  answer,
  getOne,
  deleteQuestion,
  getQuestionLacture,
  getOneQuestion,
  unactivateQuestion,
  getAnswerdQuestionNumber,
};
