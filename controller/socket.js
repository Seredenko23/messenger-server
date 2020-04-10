const { generateMessage } = require('../service/message')
const User = require('../models/User')
const Thread = require('../models/Thread')
const Message = require('../models/Message')
const jwt = require('jsonwebtoken')
const escapeStringRegexp = require('escape-string-regexp')

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.use((packet, next) => {
      const token = packet[1].token
      if (token == null) return socket.emit('serverError', 'unauthorized')

      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err) => {
        if (err) return socket.emit('serverError', 'forbidden')
        next()
      })
    })

    socket.on('message', async (packet) => {
      let genMessage = await generateMessage(packet.message);
      if (genMessage.type === 'error') {
        await socket.emit('serverError', genMessage.desc)
      } else {
        try {
          let savedMessage = await genMessage.result.save();
          let normalizedMessage = await Message.findById(savedMessage._id).populate('user').exec()
          const room = Object.keys(socket.rooms)[0]
          await io.in(room).emit('message', normalizedMessage)
        } catch (e) {
          await socket.emit('serverError', e)
        }
      }
    })

    socket.on('typing', async (packet) => {
      const room = Object.keys(socket.rooms)[0];
      socket.broadcast.in(room).emit('typing', packet.isTyping)
    })

    socket.on('new thread', async (packet) => {
      const curUser = await User.findById(packet.currentUser).exec()

      const user = await User.findById(packet.user).exec()

      if(!user || !curUser) return await socket.emit('serverError', 'Not found')

      const thread = new Thread({
        users: [ packet.currentUser, packet.user ]
      });

      console.log(thread);

      try {
        const savedThread = await thread.save()
        let normalizedThread = await Thread.findById(savedThread._id).populate('users').exec()
        await io.emit('new thread', normalizedThread)
      } catch (e) {
        await socket.emit('serverError', e)
      }
    })

    socket.on('join', (packet) => {
      if(socket.rooms) socket.leaveAll()

      socket.join(packet.threadId)
    })

    socket.on('search', (packet) => {
      let query = {}

      let searchRegExp = new RegExp(`${escapeStringRegexp(packet.searchStr)}`)
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
