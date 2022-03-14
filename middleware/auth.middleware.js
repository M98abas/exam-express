const db = require("../services/db");

const { errRes } = require("../utils/util.services");
// const CONFIG from "../config";
const jwt = require("jsonwebtoken");
// const { PrismaClient } from "@prisma/client";

module.exports = async (req, res, next) => {
  //get token
  let token = req.headers.token;
  if (!token) return errRes(res, "You need to authenticate");
  // verfiy token
  // console.log(token);
  try {
    let payload;
    payload = jwt.verify(token, "3o33w34mmrm3or3o");
    let istractors = await db.query(
      `select * from istractors where email='${payload.email}'`
    );
    req.istractors = istractors;
    // console.log(istractors);
    return next();
  } catch (error) {
    return errRes(res, "invalid token");
  }
};
