const { Router } = require('express');
const Poll = require('../models/Poll');


module.exports = Router()
  .post('/', (req, res, next) => {
    Poll
      .create()
      .then(poll => res.send(poll))
      .catch(next);

  })