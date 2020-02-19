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
  body: {
    type: String,
    required: true
  }
}, {
  timestamp: {timestamps: { createdAt: 'created_at' }}
})

module.exports = mongoose.model('Message', MessageSchema)
