'use latest';
import bodyParser from 'body-parser';
import express from 'express';
import Webtask from 'webtask-tools';
const mongoose = require('mongoose');
import { ObjectID } from 'mongodb';
const collection = 'avengers';
const server = express();

const Avenger = mongoose.model('Avenger', { 
  name: String, 
  avenger_name: String 
});

server.use(bodyParser.json());

server.get('/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  mongoose.connect(MONGO_URL, {useNewUrlParser: true}).catch(err => next(err));

  return Avenger.find({}).then(result => res.status(200).json(result));
});

server.get('/:_id', (req, res, next) => {
  const { _id } = req.params;
  const { MONGO_URL } = req.webtaskContext.secrets;
  mongoose.connect(MONGO_URL, {useNewUrlParser: true}).catch(err => next(err));
  return Avenger.findOne({ _id: new ObjectID(_id) }).then(result => res.status(200).json(result));
});

server.post('/', (req, res, next) => {
  const { MONGO_URL } = req.webtaskContext.secrets;
  // Do data sanitation here.
  const model = req.body;
  mongoose.connect(MONGO_URL, {useNewUrlParser: true}).catch(err => next(err));
  
  const avenger = new Avenger(model);
  avenger.save((err, doc) => {
    if (err) {
      return res.status(500).json(err);
    }

    return res.status(201).json(doc);
  })
});
module.exports = Webtask.fromExpress(server);
