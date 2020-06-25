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

schema.statics.getsVotesAndResults = function(id) {
  return this.model('Vote').aggregate([
    {
      '$match': {
        'poll': mongoose.Types.ObjectId(id)
      }
    }, {
      '$group': {
        '_id': {
          'poll': '$poll', 
          'options': '$options'
        }, 
        'count': {
          '$sum': 1
        }
      }
    }, {
      '$group': {
        '_id': '$_id.poll', 
        'totalCount': {
          '$sum': '$count'
        }, 
        'options': {
          '$push': {
            'options': '$_id.options', 
            'count': '$count'
          }
        }
      }
    }
  ]);
};

schema.statics.averageVotesPerPoll = function() {
  return this.model('Vote').aggregate([
    {
      '$group': {
        '_id': '$poll', 
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
module.exports = mongoose.model('Poll', schema);
