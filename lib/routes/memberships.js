const { Router } = require('express');

const Membership = require('../models/Membership');

module.exports = Router()
  .post('/', (req, res, next) => {
    Membership
      .create(req.body)
      .then(membership => res.send(membership))
      .catch(next);  
  })
   
  .delete('/:id', (req, res, next) => {
    Membership
      .findByIdAndDelete(req.params.id)
      .then(membership => res.send(membership))
      .catch(next); 

  })