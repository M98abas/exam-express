const db = require("../services/db");
const { validate } = require("validate.js");
const { okRes, errRes } = require("../utils/util.services");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function register(req, res) {
  // try {
  // get body
  const body = req.body;
  // console.log(body);
  let spliteOne = body.email.split("@");
  // spliteOne.
  // console.log(spliteOne[1] != "MK.com" || spliteOne[1] != "mk.com");
  if (spliteOne[1] != "MK.com" && spliteOne[1] != "mk.com")
    return errRes(res, { errMsg: "Email not valid" });
  // validate body
  let must = true;
  let notValid = validate(body, {
    email: { presence: must, type: "string", email: must },
    password: { presence: must, type: "string" },
  });
  if (notValid)
    return errRes(res, { errMsg: "The data you send is not valid" });
  let email = body.email;
  // hash the password
  salt = await bcrypt.genSalt(12);
  let password = await bcrypt.hash(body.password, salt);
  body.password = password;
  // check if user already reigester
  let lecture = await db.query(`select * from lecture where email='${email}' `);
  if (!lecture) return errRes(res, { errMsg: "You already have an account" });
  else {
    // console.log(body);
    await db.query(
      `insert into admin(email,password) values ('${body.email}','${body.password}')`
    );
    // console.log(newStudent);
  } //Done
  // send the token
  let token = jwt.sign({ email: email }, "3o33w34mmrm3or3o");
  return okRes(res, { token });
  // } catch {
  //   return errRes(res, {
  //     errMsg: "There is an error Occured while the process",
  //   });
  // }
}
async function login(req, res) {
  // try {
  // get body
  const body = req.body;
  // console.log(body);
  // validated the body
  let must = false;
  let notValid = validate(body, {
    email: { presence: must, type: "string", email: must },
    password: { presence: must, type: "string" },
  });
  if (notValid) return errRes(res, "The data you send is not valid");
  // take the user from db
  user = await db.query(`select * from admin where email='${body.email}'`);
  if (!user) return errRes(res, "The user not found");
  // console.log(user/);
  // validate the password
  let check = await bcrypt.compare(body.password, user[0].password);
  // console.log(check);
  if (!check) return errRes(res, "Not valide credentials");
  // send the token to the front-end
  let token = jwt.sign({ email: user[0].email }, "3o33w34mmrm3or3o");
  user = user[0].email;
  // console.log(token);
  return okRes(res, { token, user });
  // } catch {
  //   return errRes(err, "Error");
  // }
}
module.exports = {
  register,
  login,
};
