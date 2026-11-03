require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Item = require('../models/Item');
const Bid = require('../models/Bid');

// Seeds a demo seller and a few live listings so the app has content
// on first run. Demo login: seller@example.com / password123
async function seed() {
  await connectDB();
  await Promise.all([User.deleteMany({}), Item.deleteMany({}), Bid.deleteMany({})]);

  const seller = new User({ name: 'Demo Seller', email: 'seller@example.com' });
  await seller.setPassword('password123');
  await seller.save();

  const now = Date.now();
  const listings = [
    ['Vintage Film Camera', 'Fully serviced 35mm rangefinder in working condition.', 'Collectibles', 120, 26],
    ['Mechanical Keyboard', 'Hot-swappable switches, PBT keycaps, USB-C.', 'Electronics', 45, 8],
    ['Acoustic Guitar', 'Solid spruce top, low action, includes soft case.', 'Other', 200, 50],
    ['First-Edition Book Set', 'Three-volume set, dust jackets intact.', 'Collectibles', 85, 12],
  ];
  for (const [title, description, category, startingPrice, hours] of listings) {
    await Item.create({
      title,
      description,
      category,
      startingPrice,
      currentPrice: startingPrice,
      seller: seller._id,
      endsAt: new Date(now + hours * 60 * 60 * 1000),
    });
  }
  console.log('Seed complete. Demo login: seller@example.com / password123');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
