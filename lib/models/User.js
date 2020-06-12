
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
    virtuals: true,
    transform: (doc, ret) => {
      delete ret.id;
    }
  }
}
);

schema.statics.FindUsersOrganizations = async function(id) {

  const user = await this.findById(id).lean();
  const organizations = await this.model('Membership').find({ user: user._id }).populate('organization').lean();
  return { ...user, organizations: [...organizations] };
};

schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'user'
});



module.exports = mongoose.model('User', schema);
