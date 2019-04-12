const mongoose = require('mongoose');

const campgroundSchema = new mongoose.Schema({
  name: String,
  price: { type: String, default: '0.00' },
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

module.exports = mongoose.model('Campground', campgroundSchema);
