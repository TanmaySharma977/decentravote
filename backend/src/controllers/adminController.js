const User = require('../models/User');

exports.getStats = async (req, res) => {
  try {
    const total    = await User.countDocuments({ role: 'voter' });
    const pending  = await User.countDocuments({ role: 'voter', status: 'pending' });
    const approved = await User.countDocuments({ role: 'voter', status: 'approved' });
    const rejected = await User.countDocuments({ role: 'voter', status: 'rejected' });
    res.json({ total, pending, approved, rejected });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'voter' }).select('-password');
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.approveUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'approved' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} approved`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: `${user.name} rejected`, user });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};