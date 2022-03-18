const db = require("../services/db");

const { errRes } = require("../utils/util.services");
// const CONFIG from "../config";
const jwt = require("jsonwebtoken");
// const { PrismaClient } from "@prisma/client";

module.exports = async (req, res, next) => {
  //get token
  let token = req.headers.token;
  // console.log(token);
  if (!token) return errRes(res, "You need to authenticate");
  // verfiy token
  // console.log(token);
  try {
    let payload;
    payload = jwt.verify(token, "3o33w34mmrm3or3o");
    let admin = await db.query(
      `select * from admin where email='${payload.email}'`
    );
    console.log(admin);
    req.admin = admin;
    // console.log(istractors);
    return next();
  } catch (error) {
    return errRes(res, "invalid token");
  }
};
