const { generateMessage, normalizeMessage} = require('../service/message')
const User = require('../models/User')
const Message = require('../models/Message')
const escapeStringRegexp = require('escape-string-regexp')

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('message', async (message) => {
      let genMessage = await generateMessage(message);
      if (genMessage.type === 'error') {
        await socket.emit('serverError', genMessage.desc)
      } else {
        try {
          let savedMessage = await genMessage.result.save();
          let normalizedMessage = await Message.findById(savedMessage._id).populate('user').exec()
          const room = Object.keys(socket.rooms)[0]
          await io.in(room).emit('message', normalizedMessage)
        } catch (e) {
          await socket.emit('error', e)
        }
      }
    })

    socket.on('typing', async (isTyping) => {
      const room = Object.keys(socket.rooms)[0];
      socket.broadcast.in(room).emit('typing', isTyping)
    })

    socket.on('join', (threadId) => {
      if(socket.rooms) socket.leaveAll()

      socket.join(threadId)
    })

    socket.on('search', (searchStr) => {
      let query = {}

      let searchRegExp = new RegExp(`${escapeStringRegexp(searchStr)}`)
      query.$or = [
        {
          firstName: searchRegExp
        },
        {
          lastName: searchRegExp
        }
      ]

      User.find(query)
        .exec((err, docs) => {
          if (err) {
            return socket.emit('serverError', err)
          }
          socket.emit('search', docs)
        })
    })

  })
}
