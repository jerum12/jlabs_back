const mysql = require('mysql');
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'mywebapp'
});
db.connect((err) => {
  if (err) throw err;
  console.log('MySQL connected');
});
module.exports = db;