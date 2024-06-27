const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const requestIp = require('request-ip');


const getCallerIP = (request) => {
  const ip = request.clientIp;
  if (ip === '::1') {
    // Fallback to IPv4 loopback address if the IPv6 loopback address is returned
    return '127.0.0.1';
  }
  return ip;
}

exports.register = async (req, res) => {

  try {
    const { name, email, password, user_type } = req.body;

    if(name === "" || email === "" || password === "" || user_type === ""){
      res.status(500).json({ message: 'Please Fill up all the required fields!' });
    }


    User.findByEmail(email, (err, data) => {
      if (err) {

        if (err.kind !== "not_found") {
          // console.log(data.email)
           res.status(500).send({ message: 'Email already exists!' });
         }
         
        console.error('Error checking email:', err);
         res.status(500).json({ message: 'Failed to register user' });
      }else{
        var clientIp = getCallerIP(req); // on localhost > 127.0.0.1


        // Create a new user
          const newUser = new User({ name, email, password, user_type });
          newUser.ip_address = clientIp
    
          //console.log("newUser123",newUser);
    
          User.create(newUser, (err, data) => {
            const token = jwt.sign({ email }, 'secret', { expiresIn: '1h' });
            if (err) res.status(500).json({ message: err.message });
            else res.status(201).json({ message: 'User created successfully', token , user: data});
          });
      }
    })
  

 } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Failed to register user' });
  }



};

exports.login = (req, res) => {
  const {  email, password } = req.body;

  if(email === "" || password === "" ){
    res.status(500).json({ message: 'Please Fill up all the required fields!' });
  }

  User.findByEmail(req.body.email, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `No user found with email ${req.body.email}!.` });
      } else {
        res.status(500).send({ message: "Error retrieving User with email " + req.body.email });
      }
    } else {
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (isMatch) {
          const token = jwt.sign({ id: user.id }, 'secret', { expiresIn: '1h' });
          res.send({ message: "Login successful", token, user  });
        } else {
          res.status(401).send({ message: `Invalid password for email ${req.body.email}!` });
        }
      });
    }
  });
};
