const db = require("../services/db");
const { validate } = require("validate.js");
const { okRes, errRes } = require("../utils/util.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
/**
 *
 * @param {*} page
 * @returns
 */
async function get(req, res) {
  const data = await db.query(
    "select istractors.id,istractors.name,istractor_courses.score,istractors.created_at,istractors.email,courses.name as Cname from istractor_courses inner join istractors on istractors.id = istractor_courses.istractorId inner JOIN courses on courses.Cid = istractor_courses.coursesId"
  );
  // console.log(data);
  if (data.length != 0) {
    return okRes(res, { data });
  }
  return errRes(res, "There is no data!!!");
}

/**
 *
 * @param {*} page
 * @returns
 */
async function getOne(req, res) {
  const id = parseInt(req.params.id);
  const student = await db.query(
    `select * from istractors where id='${id}' inner join exam`
  );
  // console.log(student);
  if (student) {
    return okRes(res, { student });
  }
  return errRes(res, "err");
}

/**
 *
 * @param {*} res
 * @param {*} req
 * @returns
 */
async function register(req, res) {
  try {
    const body = req.body;
    // console.log(b/ody);
    let spliteOne = body.email.split("@");
    // spliteOne.
    if (spliteOne[1] == "MK.com" && spliteOne[1] == "mk.com")
      return errRes(res, "Email not valid");

    // validate body
    let must = true;
    let notValid = validate(body, {
      name: { presence: must, type: "string" },
      email: { presence: must, type: "string" },
      password: { presence: must, type: "string" },
    });
    console.log(notValid);
    if (notValid) return errRes(res, "The data you send is not valid");
    let email = body.email;
    // hash the password
    salt = await bcrypt.genSalt(12);
    let password = await bcrypt.hash(body.password, salt);
    body.password = password;
    // check if user already reigester
    let student = await db.query(
      `select * from istractors where email='${email}' `
    );
    // console.log(body);
    if (!student) return errRes(res, "You already have an account");
    else {
      await db.query(
        `insert into istractors(name,email,password ) values ('${body.name}','${body.email}','${body.password}')`
      );
    }
    let token = jwt.sign({ email: email }, "3o34k34mmrm3or3o");
    return okRes(res, { token });
  } catch {
    return errRes(res, { msg: "There is an error Occured while the process" });
  }
}
async function login(req, res) {
  // get body
  try {
    const body = req.body;
    // let spliteOne = body.email.split("@");
    // console.log(spliteOne);
    // spliteOne.
    // if (spliteOne[1] != "MK.com") return errRes(res, "Email not valid");
    let spliteOne = body.email.split("@");
    if (spliteOne[1] != "MK.com" && spliteOne[1] != "mk.com")
      return errRes(res, { errMsg: "Email not valid" });

    // validated the body

    let must = true;
    let notValid = validate(body, {
      email: { presence: must, type: "string", email: must },
      password: { presence: must, type: "string" },
    });
    // console.log(!notValid);
    if (notValid) return errRes(res, "The data you send is not valid");
    // take the user from db
    user = await db.query(
      `select * from istractors where email=? `,
      [body.email],
      (error, result) => {
        if (error) return errRes(res, "Error");
      }
    );
    if (!user) return errRes(res, "The user not found");
    // validate the password
    // console.log(user);
    let check = await bcrypt.compare(body.password, user[0].password);
    // console.log(check);
    if (!check) return errRes(res, "Not valide credentials");
    // send the token to the front-end
    let token = jwt.sign({ email: user[0].email }, "3o33w34mmrm3or3o");
    user = user[0].name;

    return okRes(res, { token, user });
  } catch {
    return errRes(res, "Error");
  }
}

module.exports = {
  get,
  getOne,
  login,
  register,
};
