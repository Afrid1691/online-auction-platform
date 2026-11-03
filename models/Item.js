const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['Electronics', 'Collectibles', 'Fashion', 'Home', 'Sports', 'Other'],
      default: 'Other',
    },
    imageUrl: { type: String, trim: true, default: '' },
    startingPrice: { type: Number, required: true, min: 0 },
    currentPrice: { type: Number, required: true, min: 0 },
    seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    highestBidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    endsAt: { type: Date, required: true },
  },
  { timestamps: true }
);

itemSchema.virtual('isActive').get(function () {
  return this.endsAt > new Date();
});

itemSchema.set('toJSON', { virtuals: true });
itemSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Item', itemSchema);
