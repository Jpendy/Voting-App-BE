const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    required: true
  },

  imageUrl: {
    type: String,
    required: true
  },
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

schema.virtual('memberships', {
  ref: 'Membership',
  localField: '_id',
  foreignField: 'organization'
});

schema.statics.deleteAndDeleteAllPolls = async function(id) {
  const Poll = this.model('Poll');

  const polls = await Poll.find({ organization: id });

  const deletePollPromises = polls.map(poll => Poll.deleteAndDeleteAllVotes(poll._id));

  return Promise.all([
    this.findByIdAndDelete(id),
    ...deletePollPromises
  ])
    .then(([organization]) => organization);
};

schema.statics.averageNumberOfPolls = function() {
  return this.model('Poll').aggregate([
    {
      '$group': {
        '_id': '$organization', 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$group': {
        '_id': null, 
        'avg': {
          '$avg': '$count'
        }
      }
    }
  ]);
};

module.exports = mongoose.model('Organization', schema);
