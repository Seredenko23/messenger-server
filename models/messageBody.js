const Mixed = require("mongoose")
const mongoose = require('mongoose')

const MessageBodySchema = new mongoose.Schema({
  body: {
    type: Mixed,
    required: true
  },
  type: {
    type: String,
    required: true
  }
});

module.exports = MessageBodySchema
