require('dotenv').config();
require('../lib/utils/connect')();
const chance = require('chance').Chance();
const User = require('../lib/models/User');
const Organization = require('../lib/models/Organization');
const Poll = require('../lib/models/Poll');
const Vote = require('../lib/models/Vote');
const Membership = require('../lib/models/Membership');
const  mongoose = require('mongoose');



const seed = async({ userCount = 5, organizationCount = 10, pollCount = 20, voteCount = 100, MembershipCount = 5 } = {}) => {
  const comMed = ['phone', 'email'];
  const choices = ['yes', 'no'];
  const user = await User.create([...Array(userCount)].map(() => ({
    name: chance.name(),
    email: chance.word(),
    phone: chance.phone(),
    communicationMedium: chance.pickone(comMed),
    imageUrl: chance.url()
  })));

  const organization = await Organization.create([...Array(organizationCount)].map(() => ({
    title: chance.word(),
    description: chance.sentence(),
    imageUrl: chance.url({ path: 'images' })
  })));

  const poll = await Poll.create([...Array(pollCount)].map(() => ({
    organization: chance.pickone(organization).id,
    title: chance.word(),
    description: chance.sentence(),
    options: choices
  })));

  await Vote.create([...Array(voteCount)].map(() => ({
    poll: chance.pickone(poll).id,
    user: chance.pickone(user).id,
    options: chance.pickone(choices)
  })));

  await Membership.create([...Array(MembershipCount)].map(() => ({
    organization: chance.pickone(organization).id,
    user: chance.pickone(user).id
  })));
};

seed()
  .then(() => mongoose.connection.close());


module.exports = seed;
