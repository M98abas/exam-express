/**
 * ReE
 * @param body
 */
const errRes = (res, err, code = 400) => {
  return res.json({ status: code, errMsg: err });
};

/**
 * ReS
 * @param body
 */
const okRes = (res, data, code = 200) => {
  // Success Web Response
  let sendData = { status: true, errMsg: "" };

  if (typeof data == "object") {
    sendData = Object.assign(data, sendData); //merge the objects
  }
  if (typeof code !== "undefined") res.statusCode = code;
  return res.json(sendData);
};

module.exports = { okRes, errRes };
