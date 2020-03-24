const MessageBodySchema = require('./messageBody')
const mongoose = require('mongoose')
const User = require('./User')

const MessageSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  messageBody: {
    type: MessageBodySchema,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema)
