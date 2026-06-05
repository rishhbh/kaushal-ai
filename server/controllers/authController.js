const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Employer = require('../models/Employer');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const options = {
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
    maxAge: 30 * 24 * 60 * 60 * 1000
  };
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user
  });
};

// @desc    Register Worker
// @route   POST /api/auth/register/worker
const registerWorker = asyncHandler(async (req, res) => {
  console.log('Worker Registration Payload:', req.body);
  const { name, phone, password, district, state, trade, experience, language } = req.body;
  if (!name || !phone || !password) {
    res.status(400); throw new Error('Please include all fields');
  }
  const userExists = await User.findOne({ phone });
  if (userExists) {
    res.status(400); throw new Error('Worker with this phone already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name, phone, passwordHash, district, state, trade, experience, language, skillLevel: 'Beginner'
  });
  
  if (user) {
    sendTokenResponse(user, 201, res);
  } else {
    res.status(400); throw new Error('Invalid user data');
  }
});

// @desc    Register Employer
// @route   POST /api/auth/register/employer
const registerEmployer = asyncHandler(async (req, res) => {
  const { companyName, email, password, gst, industry, companySize, city, state, contactName } = req.body;
  if (!companyName || !email || !password) {
    res.status(400); throw new Error('Please include all required fields');
  }
  const employerExists = await Employer.findOne({ email });
  if (employerExists) {
    res.status(400); throw new Error('Employer with this email already exists');
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const employer = await Employer.create({
    companyName, email, passwordHash, gst, industry, companySize, city, state, contactName
  });

  if (employer) {
    sendTokenResponse(employer, 201, res);
  } else {
    res.status(400); throw new Error('Invalid employer data');
  }
});

// @desc    Login User/Employer
// @route   POST /api/auth/login
const login = async (req, res) => {
  try {
    const { phone, email, password, role } = req.body;
    
    if (role === 'worker') {
      const user = await User.findOne({ phone });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (isMatch) {
        return sendTokenResponse(user, 200, res);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else if (role === 'employer') {
      const employer = await Employer.findOne({ email });
      if (!employer) {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
      const isMatch = await bcrypt.compare(password, employer.passwordHash);
      if (isMatch) {
        return sendTokenResponse(employer, 200, res);
      } else {
        return res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role specified' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @desc    Logout user/employer
// @route   POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

// @desc    Get current user
// @route   GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, user: req.user, role: req.userType });
});

// @desc    Update preferred language
// @route   PATCH /api/auth/language
const updateLanguage = asyncHandler(async (req, res) => {
  const { language } = req.body;
  if (!language) {
    res.status(400); throw new Error('Please provide a language code');
  }

  const Model = req.userType === 'worker' ? User : Employer;
  const user = await Model.findByIdAndUpdate(req.user._id, { language }, { new: true }).select('-passwordHash');
  
  res.status(200).json({ success: true, user });
});

// @desc    Skip Assessment
// @route   PATCH /api/auth/skip-assessment
const skipAssessment = asyncHandler(async (req, res) => {
  if (req.userType !== 'worker') {
    res.status(403); throw new Error('Not authorized');
  }
  const user = await User.findByIdAndUpdate(req.user._id, { assessmentSkipped: true, skillLevel: 'Beginner' }, { new: true }).select('-passwordHash');
  res.status(200).json({ success: true, user });
});

module.exports = { registerWorker, registerEmployer, login, logout, getMe, updateLanguage, skipAssessment };
