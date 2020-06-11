
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
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

  communicationMedium: {
    type: String,
    required: true,
    enum: ['phone', 'email']
  },

  imageUrl: {
    type: String,
    required: true
  } 
},
{
  toJSON: {
    virtuals: true
  }
}
);

schema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'user'
});



module.exports = mongoose.model('User', schema);
