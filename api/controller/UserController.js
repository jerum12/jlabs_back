const User = require('../models/User');

exports.getProfile = (req, res) => {

  User.findById(req.userId, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found User with id ${req.userId}.` });
      } else {
        res.status(500).send({ message: "Error retrieving User with id " + req.userId });
      }
    } else res.send({ message: "User succesfully retrieved! " , user});
  });
};

exports.updateProfile = (req, res) => {
    const { id } = req.params; 
    const {  email, password } = req.body;
    if(email === "" || password === "" ){
        res.status(500).json({ message: 'Please Fill up all the required fields!' });
      }

  User.updateById(id, new User(req.body), (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found User with id ${req.userId}.` });
      } else {
        res.status(500).send({ message: "Error updating User with id " + req.userId });
      }
    } else res.send({ message: "User updated successfully!"});
  });
};
