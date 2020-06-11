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

module.exports = mongoose.model('Organization', schema);
