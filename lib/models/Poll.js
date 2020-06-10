const mongoose = require('mongoose');

const schema = new mongoose.Schema({
   
  organization: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Organization',
    required: true
  },  

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  options: {
    type: String,
    enum: ['Approve', 'Disapprove'],
    required: true
  }
});

module.exports = mongoose.model('Poll', schema);
