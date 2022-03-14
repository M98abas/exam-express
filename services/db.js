const mysql = require("mysql2/promise");
const config = require("../config");

async function query(sql, values, params) {
  const connection = await mysql.createConnection(config.db);
  const [results] = await connection.execute(sql, values, params);
  return results;
}

module.exports = {
  query,
};
