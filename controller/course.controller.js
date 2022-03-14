const db = require("../services/db");
const { validate } = require("validate.js");
const { okRes, errRes } = require("../utils/util.services");

/**
 *
 * @param {*} page
 * @returns
 */
async function get(req, res) {
  try {
    const data = await db.query(
      "select courses.Cid,courses.name,courses.field from courses where EXISTS ( SELECT courseId from question where question.courseId = courses.Cid AND question.active=1)"
    );
    // console.log(data);
    if (data) {
      return okRes(res, { data });
    }
  } catch {
    return errRes(res, "There is no data!!!");
  }
}

/**
 *
 * @param {*} page
 * @returns
 */
async function getField(req, res) {
  try {
    const data = await db.query("select * from courses");
    // console.log(data);
    if (data) {
      return okRes(res, { data });
    }
  } catch {
    return errRes(res, "There is no data!!!");
  }
}
/**
 *
 * @param {*} page
 * @returns
 */
async function getForLacture(req, res) {
  // try {
  let lacture = req.lecture;
  // console.log(lacture);
  const data = await db.query(
    `select * from lecture inner join courses_lecture on lecture.id = courses_lecture.lectureId inner join courses on courses.Cid = courses_lecture.courseId where lecture.id=${lacture[0].id}`
  );
  // const count = await db.query(
  //   `select count(*) from question inner join courses on courses.Cid = question.courseId where question.lectureId='${lacture[0].id}'`
  // );
  // console.log(data);
  if (data) {
    return okRes(res, { data });
  }
  // } catch {
  //   return errRes(res, "There is no data!!!");
  // }
}

/**
 *
 * @param {*} page
 * @returns
 */
async function getAllWithStudent(req, res) {
  // try {
  const lecture = req.lecture;
  // console.log(lecture);
  const data = await db.query(
    `select istractors.id,istractors.email,istractors.name,istractor_courses.score,istractor_courses.created_at, courses.name as cName from istractor_courses inner join courses_lecture on courses_lecture.courseId= istractor_courses.coursesId INNER join courses on courses.Cid = courses_lecture.courseId inner join istractors on istractors.id=istractor_courses.istractorId  where courses_lecture.lectureId =${lecture[0].id}`
  );
  // console.log(data);

  if (data) {
    return okRes(res, { data });
  }
  // } catch {
  //   return errRes(res, "There is no data!!!");
  // }
}

/**
 *
 * @param {*} page
 * @returns
 */
async function getOne(req, res) {
  const id = parseInt(req.params.id);
  const course = await db.query(`select * from courses where Cid='${id}'`);
  if (course) {
    return okRes(res, { course });
  }
  return errRes(res, err);
}

/**
 *
 * @param {*} page
 * @returns
 */
async function getOneAndSet(req, res) {
  const id = parseInt(req.params.id);
  console.log("id ", req.params.id);
  const istractor = req.istractors;
  console.log(istractor);
  const course = await db.query(`select * from courses where Cid='${id}'`);
  // console.log(req.params);
  if (course) {
    await db.query(
      `insert into istractor_courses(istractorId,coursesId) values (${istractor[0].id},${id})`
    );
    return okRes(res, "Done");
  }
  return errRes(res, err);
}

/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function update(req, res) {
  const id = parseInt(req.params.id);
  const course = await db.query(
    `update courses set name='${body.name}',field= ${body.email},lectureId= ${body.lecture},status= ${body.status} where id='${id}'`
  );
  if (course) return okRes(res, course);
  return errRes(res, err);
}
/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function add(req, res) {
  //  get body
  const body = req.body;
  const lectureEmail = body.lecture;
  // console.log(Validate.course());
  // validate body
  let notValid = validate(body, {
    name: { presence: true, type: "string" },
    field: { presence: true, type: "string" },
    status: { presence: true, type: "string" },
  });
  var today = new Date();
  var date =
    today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate();
  // console.log(typeof "he");
  const sql = `SELECT * FROM lecture WHERE email='${lectureEmail}'`;
  if (notValid) return errRes(res, "The data you send is not valid");
  let lecture = await db.query(sql);
  try {
    let course = await db.query(
      `insert into courses(name,field,date_started,lectureId,status) values ('${body.name}','${body.field}','${date}','${lecture[0].id}','${body.status}')`
    );
    return okRes(res, course);
  } catch {
    return errRes(res, "Something went wrong");
  }
}

/**
 *
 * @param {*} page
 * @returns
 */
async function deleteOne(req, res) {
  const id = parseInt(req.params.id);
  const course = await db.query(
    `update courses set status='Removed' where id='${id}'`
  );
  return okRes(res, { course });
}
module.exports = {
  get,
  getField,
  add,
  getOne,
  update,
  deleteOne,
  getAllWithStudent,
  getForLacture,
  getOneAndSet,
};
