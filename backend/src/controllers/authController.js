const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already registered' });
    await User.create({ name, email, password });
    res.status(201).json({ message: 'Registration submitted. Await admin approval.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });
    if (user.status === 'pending')
      return res.status(403).json({ message: 'Your account is pending admin approval' });
    if (user.status === 'rejected')
      return res.status(403).json({ message: 'Your registration was rejected' });
    res.json({
      token: generateToken(user._id, user.role),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};