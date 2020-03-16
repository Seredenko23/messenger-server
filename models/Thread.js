const mongoose = require('mongoose')
const User = require('./User')

const ThreadSchema = new mongoose.Schema({
  users: {
    type: [mongoose.model('User').schema],
    required: true,
  }
})

module.exports = mongoose.model('Thread', ThreadSchema)
