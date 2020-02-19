const mongoose = require('mongoose')

const ThreadSchema = new mongoose.Schema({
  users: {
    type: [String],
    required: true,
  }
})

module.exports = mongoose.model('Thread', ThreadSchema)
