// Custom middleware that controls access to protected routes.

// Blocks unauthenticated users and sends them to the login page,
// remembering where they were headed.
function requireAuth(req, res, next) {
  if (req.session && req.session.userId) return next();
  req.flash('error', 'Please log in to continue.');
  return res.redirect('/auth/login');
}

// Loads the item from the route param and only lets its seller through.
// Used for edit/delete so one user cannot modify another user's listing.
async function requireItemOwner(req, res, next) {
  try {
    const Item = require('../models/Item');
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Listing not found.');
      return res.redirect('/items');
    }
    if (!item.seller.equals(req.session.userId)) {
      req.flash('error', 'You can only manage your own listings.');
      return res.redirect(`/items/${item._id}`);
    }
    req.item = item;
    return next();
  } catch (err) {
    return next(err);
  }
}

// Exposes the logged-in user (and flash messages) to every view.
async function attachCurrentUser(req, res, next) {
  res.locals.currentUser = null;
  if (req.session && req.session.userId) {
    const User = require('../models/User');
    res.locals.currentUser = await User.findById(req.session.userId).select('name email');
  }
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
}

module.exports = { requireAuth, requireItemOwner, attachCurrentUser };
