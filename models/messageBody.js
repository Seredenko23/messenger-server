const mongoose = require('mongoose')

const MessageBodySchema = new mongoose.Schema({
  body: {
    type: mongoose.Mixed,
    required: true
  },
  type: {
    type: String,
    required: true
  }
}, {_id: false});

module.exports = MessageBodySchema
