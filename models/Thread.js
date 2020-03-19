const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
  users: [{
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }]
})

module.exports = mongoose.model('Thread', ThreadSchema)
