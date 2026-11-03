const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    bidder: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

bidSchema.index({ item: 1, createdAt: -1 });

module.exports = mongoose.model('Bid', bidSchema);
