const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const requestIp = require('request-ip');
// Middleware to use request-ip
app.use(requestIp.mw());

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const authRoutes = require('./api/routes/AuthRoutes'); 
const userRoutes = require('./api/routes/UserRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on localhost port ${PORT}`);
});
