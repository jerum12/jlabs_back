const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let token = req.headers['authorization'];
  if (!token) return res.status(403).send({ message: 'No token provided!' });
  
  jwt.verify(token.split(' ')[1], 'secret', (err, decoded) => {

   // console.log(err)
    if (err) return res.status(500).send({ message: 'Failed to authenticate token.' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = verifyToken;
