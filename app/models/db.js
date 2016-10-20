'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

let dbURI = 'mongodb://localhost/tweet';
if (process.env.NODE_ENV === 'production') {
  //dbURI = process.env.MONGOLAB_URI;
  dbURI = 'mongodb://homer:secret@ds027145.mlab.com:27145/mytweet';
}

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
