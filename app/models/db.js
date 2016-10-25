'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/tweet';
console.log('Mongoose connected to ' + dbURI);
mongoose.connection.on('connected', function () {
  if (process.env.NODE_ENV === 'production') {
    dbURI = 'mongodb://homer:secret@ds027145.mlab.com:27145/mytweet';
  }
  if (process.env.NODE_ENV != 'production') {
    //dbURI = process.env.MONGOLAB_URI;
    var seeder = require('mongoose-seeder');
    const data = require('./data.json');
    const Tweet = require('./Tweet');
    const user = require('./user');
    seeder.seed(data, { dropDatabase: false, dropCollections: true }).then(dbData => {
      console.log('preloading Test Data');
      console.log(dbData);
    }).catch(err => {
      console.log(error);
    });
  }
})

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
  console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
  console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose disconnected');
});
