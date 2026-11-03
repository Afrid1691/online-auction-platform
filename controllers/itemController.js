const Item = require('../models/Item');
const Bid = require('../models/Bid');

exports.listItems = async (req, res, next) => {
  try {
    const { category, q } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (q) filter.title = { $regex: q, $options: 'i' };
    const items = await Item.find(filter)
      .populate('seller', 'name')
      .sort({ endsAt: 1 })
      .lean();
    res.render('items/index', {
      title: 'Live auctions',
      items,
      categories: Item.schema.path('category').enumValues,
      activeCategory: category || '',
      q: q || '',
    });
  } catch (err) {
    return next(err);
  }
};

exports.showItem = async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('seller', 'name')
      .populate('highestBidder', 'name');
    if (!item) {
      req.flash('error', 'Listing not found.');
      return res.redirect('/items');
    }
    const bids = await Bid.find({ item: item._id })
      .populate('bidder', 'name')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();
    res.render('items/show', { title: item.title, item, bids });
  } catch (err) {
    return next(err);
  }
};

exports.showCreateForm = (req, res) => {
  res.render('items/new', {
    title: 'List an item',
    categories: Item.schema.path('category').enumValues,
  });
};

exports.createItem = async (req, res, next) => {
  try {
    const { title, description, category, imageUrl, startingPrice, durationHours } = req.body;
    const price = Number(startingPrice);
    const hours = Number(durationHours) || 24;
    if (!title || !description || Number.isNaN(price) || price < 0) {
      req.flash('error', 'Title, description and a valid starting price are required.');
      return res.redirect('/items/new');
    }
    const item = await Item.create({
      title,
      description,
      category,
      imageUrl,
      startingPrice: price,
      currentPrice: price,
      seller: req.session.userId,
      endsAt: new Date(Date.now() + hours * 60 * 60 * 1000),
    });
    req.flash('success', 'Your item is live. Good luck with the auction!');
    return res.redirect(`/items/${item._id}`);
  } catch (err) {
    return next(err);
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    await Bid.deleteMany({ item: req.item._id });
    await req.item.deleteOne();
    req.flash('success', 'Listing removed.');
    return res.redirect('/items');
  } catch (err) {
    return next(err);
  }
};
