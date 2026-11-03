const Item = require('../models/Item');
const Bid = require('../models/Bid');

exports.placeBid = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      req.flash('error', 'Listing not found.');
      return res.redirect('/items');
    }
    if (!item.isActive) {
      req.flash('error', 'This auction has ended.');
      return res.redirect(`/items/${item._id}`);
    }
    if (item.seller.equals(req.session.userId)) {
      req.flash('error', 'You cannot bid on your own listing.');
      return res.redirect(`/items/${item._id}`);
    }

    const amount = Number(req.body.amount);
    if (Number.isNaN(amount) || amount <= item.currentPrice) {
      req.flash('error', `Your bid must be higher than the current price of $${item.currentPrice.toFixed(2)}.`);
      return res.redirect(`/items/${item._id}`);
    }

    await Bid.create({ item: item._id, bidder: req.session.userId, amount });
    item.currentPrice = amount;
    item.highestBidder = req.session.userId;
    await item.save();

    // connect-flash gives the bidder instant feedback on the next page load,
    // which is how bid and auction notifications surface in this app.
    req.flash('success', `You are now the highest bidder at $${amount.toFixed(2)}.`);
    return res.redirect(`/items/${item._id}`);
  } catch (err) {
    return next(err);
  }
};
