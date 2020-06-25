const { Router } = require('express');
const Poll = require('../models/Poll');


module.exports = Router()
  .post('/', (req, res, next) => {
    Poll
      .create(req.body)
      .then(poll => res.send(poll))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Poll
      .find(req.query)
      .populate('organization', {
        _id: true,
        title: true
      })
      .then(poll => res.send(poll))
      .catch(next);
  })

  .get('/average', (req, res, next) => {
    Poll
      .averageVotesPerPoll()
      .then(average => res.send(average))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Poll
      .findById(req.params.id)
      .populate('organization')
      .populate('votes')
      .then(poll => res.send(poll))
      .catch(next);
  })

  .get('/results/:id', (req, res, next) => {
    Poll
      .getsVotesAndResults(req.params.id)
      .then(result => res.send(result))
      .catch(next);
  })

  .patch('/:id', (req, res, next) => {
    Poll
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(poll => res.send(poll))
      .catch(next);
  })

  .delete('/:id', (req, res, next) => {
    Poll
      .deleteAndDeleteAllVotes(req.params.id)
      .then(poll => res.send(poll))
      .catch(next);
  });


