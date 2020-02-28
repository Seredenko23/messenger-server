const mongoose = require('mongoose')
const User = require('./User')

const MessageSchema = new mongoose.Schema({
  threadId: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.model('User').schema,
    required: true,
  },
  messageBody: {
    type: String,
    required: true
  }
}, { timestamps: true })

module.exports = mongoose.model('Message', MessageSchema)
