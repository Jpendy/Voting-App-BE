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

  options: [String]  
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

schema.virtual('votes', {
  ref: 'Vote',
  localField: '_id',
  foreignField: 'poll',
  count: true
});

schema.statics.deleteAndDeleteAllVotes = function(id) {
  return Promise.all([
    this.findByIdAndDelete(id),
    this.model('Vote').deleteMany({ poll: id })
  ])
    .then(([poll]) => poll);

};


module.exports = mongoose.model('Poll', schema);
