const User = require('../models/User');

exports.showRegister = (req, res) => {
  res.render('auth/register', { title: 'Create account' });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      req.flash('error', 'All fields are required.');
      return res.redirect('/auth/register');
    }
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      req.flash('error', 'An account with that email already exists.');
      return res.redirect('/auth/register');
    }
    const user = new User({ name, email });
    await user.setPassword(password);
    await user.save();
    req.session.userId = user._id;
    req.flash('success', `Welcome, ${user.name}. Your account is ready.`);
    return res.redirect('/items');
  } catch (err) {
    return next(err);
  }
};

exports.showLogin = (req, res) => {
  res.render('auth/login', { title: 'Log in' });
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await user.comparePassword(password || ''))) {
      req.flash('error', 'Invalid email or password.');
      return res.redirect('/auth/login');
    }
    req.session.userId = user._id;
    req.flash('success', `Welcome back, ${user.name}.`);
    return res.redirect('/items');
  } catch (err) {
    return next(err);
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect('/items');
  });
};
