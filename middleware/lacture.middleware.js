const db = require("../services/db");
const { errRes } = require("../utils/util.services");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  //get token
  let token = req.headers.token;
  // console.log(token);
  if (!token) return errRes(res, "You need to authenticate");
  // verfiy token

  try {
    let payload;
    payload = jwt.verify(token, "3o33w34mmrm3or3o");
    // console.log(payload);
    let lecture = await db.query(
      `select * from lecture where email='${payload.email}'`
    );
    req.lecture = lecture;
    return next();
  } catch (error) {
    return errRes(res, "invalid token");
  }
};
