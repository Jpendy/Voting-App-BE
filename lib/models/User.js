
const mongoose = require('mongoose');

const schema = new mongoose.schema({

  name: {
    type: String,
    required: true
  },

  phone: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true
  },

  communcationMedium: {
    type: String,
    required: true,
    enum: ['phone', 'email']
  },

  imageUrl: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('User', schema);
