const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Employer = require('../models/Employer');

const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if worker or employer
    let user = await User.findById(decoded.id).select('-passwordHash');
    if (user) {
      req.user = user;
      req.userType = 'worker';
      return next();
    }
    
    user = await Employer.findById(decoded.id).select('-passwordHash');
    if (user) {
      req.user = user;
      req.userType = 'employer';
      return next();
    }

    res.clearCookie('token');
    return res.status(401).json({ success: false, message: 'Session expired, please register again' });
  } catch (error) {
    res.clearCookie('token');
    const message = error.message === 'Session expired, please register again' ? error.message : 'Not authorized, token failed';
    return res.status(401).json({ success: false, message });
  }
});

const employerOnly = (req, res, next) => {
  if (req.user && req.userType === 'employer') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as an employer');
  }
};

const workerOnly = (req, res, next) => {
  if (req.user && req.userType === 'worker') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as a worker');
  }
};

module.exports = { protect, employerOnly, workerOnly };
