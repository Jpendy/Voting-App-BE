const { MongoMemoryServer } = require('mongodb-memory-server');
const mongod = new MongoMemoryServer();
const mongoose = require('mongoose');
const connect = require('../lib/utils/connect');

const request = require('supertest');
const app = require('../lib/app');

const Organization = require('../lib/models/Organization');
const User = require('../lib/models/User');

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


  it('it creates an organization', () => {
    return request(app)
      .post('/api/v1/organizations')
      .send({
        title: 'Cool Organization',
        description: 'Cool description',
        imageUrl: 'Image url placeholder'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Cool Organization',
          description: 'Cool description',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it gets all organization but leaves out the description', () => {
    return Organization.create({
      title: 'Cool Organization',
      description: 'Cool description',
      imageUrl: 'Image url placeholder'
    })
      .then(() => request(app).get('/api/v1/organizations'))
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.anything(),
          title: 'Cool Organization',
          imageUrl: 'Image url placeholder'
        }]);
      });     
  });

  it('it get an organization by id with GET', () => {
    return Organization.create({
      title: 'Cool Organization',
      description: 'Cool description',
      imageUrl: 'Image url placeholder'
    })
      .then(organization => request(app).get(`/api/v1/organizations/${organization._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Cool Organization',
          description: 'Cool description',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it updates an organization by id with PATCH', () => {
    return Organization.create({
      title: 'Cool Organization',
      description: 'Cool description',
      imageUrl: 'Image url placeholder'
    })
      .then(organization => {
        return request(app)
          .patch(`/api/v1/organizations/${organization._id}`)
          .send({ title: 'Super Lame Organization' });
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Super Lame Organization',
          description: 'Cool description',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it deletes an organization by id with DELETE', () => {
    return Organization.create({
      title: 'Cool Organization',
      description: 'Cool description',
      imageUrl: 'Image url placeholder'
    }) 
      .then(organization => request(app).delete(`/api/v1/organizations/${organization._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          title: 'Cool Organization',
          description: 'Cool description',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });


  it('it creates a new user', () => {
    return request(app)
      .post('/api/v1/users')
      .send({
        name: 'Jake',
        phone: '123-123-4567',
        email: 'placeholder@email.com',
        communicationMedium: 'email',
        imageUrl: 'Image url placeholder'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Jake',
          phone: '123-123-4567',
          email: 'placeholder@email.com',
          communicationMedium: 'email',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it gets a user by id with GET', () => {
    return User.create({
      name: 'Jake',
      phone: '123-123-4567',
      email: 'placeholder@email.com',
      communicationMedium: 'email',
      imageUrl: 'Image url placeholder'
    })
      .then(user => request(app).get(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Jake',
          phone: '123-123-4567',
          email: 'placeholder@email.com',
          communicationMedium: 'email',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it updates a user by id with PATCH', () => {
    return User.create({
      name: 'Jake',
      phone: '123-123-4567',
      email: 'placeholder@email.com',
      communicationMedium: 'email',
      imageUrl: 'Image url placeholder'
    })
      .then(user => {
        return  request(app).patch(`/api/v1/users/${user._id}`)
          .send({ name: 'SUPER DOPE NAME CHANGE PATCH STYLE' });
      })      
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'SUPER DOPE NAME CHANGE PATCH STYLE',
          phone: '123-123-4567',
          email: 'placeholder@email.com',
          communicationMedium: 'email',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

  it('it deletes a user by id with DELETE', () => {
    return User.create({
      name: 'Jake',
      phone: '123-123-4567',
      email: 'placeholder@email.com',
      communicationMedium: 'email',
      imageUrl: 'Image url placeholder'
    })
      .then(user => request(app).delete(`/api/v1/users/${user._id}`))
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.anything(),
          name: 'Jake',
          phone: '123-123-4567',
          email: 'placeholder@email.com',
          communicationMedium: 'email',
          imageUrl: 'Image url placeholder',
          __v: 0
        });
      });
  });

});
