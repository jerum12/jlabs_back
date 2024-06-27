const db = require('../config/db');
const bcrypt = require('bcryptjs');
const requestIp = require('request-ip');

const User = function(user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  this.ip_address = user.ip_address;
  this.user_type = user.user_type;
};

User.create = (newUser, result) => {
  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    newUser.password = hash;
    db.query("INSERT INTO users SET ?", newUser, (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      result(null, { id: res.insertId, ...newUser });
    });
  });
};

User.findByEmail = (email, result) => {
  db.query("SELECT * FROM users WHERE email = ?", [email], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
    console.log(res.length)
    if (res.length) {
      result({ kind: "found" }, res[0]);
      return;
    }
    result("", null);
  });
};

User.findById = (id, result) => {
  db.query("SELECT * FROM users WHERE id = ?", [id], (err, res) => {
    if (err) {
      result(err, null);
      return;
    }
  
    if (res.length) {
      result(null, res[0]);
      return;
    }
    result({ kind: "not_found" }, null);
  });
};

User.updateById = (id, user, result) => {
  db.query(
    "UPDATE users SET name = ?, email = ?, user_type = ? WHERE id = ?",
    [user.name, user.email, user.user_type, id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }
      if (res.affectedRows == 0) {
        result({ kind: "not_found" }, null);
        return;
      }
      result(null, { id: id, ...user });
    }
  );
};

module.exports = User;
