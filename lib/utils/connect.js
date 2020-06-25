require('dotenv').config();
const mongoose = require('mongoose');
const { parse } = require('url');

module.exports = (url = 'mongodb://localhost:27017/voting-app') => {
  mongoose.connection.on('connected', async() => {
    const parsedUrl = await parse(url);
    const redactedUrl = await `${parsedUrl.protocol}//${parsedUrl.hostname}:${parsedUrl.port}${parsedUrl.pathname}`;
    console.log(`Connected to MongoDB at ${redactedUrl}`);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Disconnected from MongoDB');
  });

  mongoose.connection.on('error', () => {
    console.log('Error connecting to MongoDB');
  });

  return mongoose.connect(url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  });
};
