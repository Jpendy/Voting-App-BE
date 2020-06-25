require('dotenv').config();
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');
const Poll = require('../lib/models/Poll');
const Membership = require('../lib/models/Membership');
const Vote = require('../lib/models/Vote');

describe('voting app routes', () => {
  beforeAll(async() => {
    const uri = await mongod.getUri();
    return connect(uri);
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(async() => {
    await mongoose.connection.close();
    return mongod.stop();
  });

  let org; 
  let user;
  let poll;

  beforeEach(async() => {
    org = await Organization.create({
      title: 'Cool Organization',
      description: 'Cool description',
      imageUrl: 'Image url placeholder'
    });

    poll = await Poll.create({
      organization: org._id,
      title: 'Cool Poll',
      description: 'Super cool poll',
      options: ['yes', 'no']
    });

    user = await User.create({
      name: 'Jake',
      phone: '123-123-4567',
      email: 'placeholder@email.com',
      communicationMedium: 'email',
      imageUrl: 'Image url placeholder'
    });

    await Vote.create({
      poll: poll._id, 
      user: user._id, 
      options: 'yes'
    });

    await Membership.create({
      organization: org._id,
      user: user._id
    });    
  });

  it('it gets the average number of polls per organization with GET', async() => {
    
    return request(app)
      .get('/api/v1/organizations/average')
      .then(res => {
        expect(res.body).toEqual([{ '_id': null, 'avg': 1 }]);
      });
  });
});

