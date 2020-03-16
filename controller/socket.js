const { generateMessage, normalizeMessage} = require('../controller/message')

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('message', async (message) => {
      let genMessage = await generateMessage(message);
      if (genMessage.type === 'error') {
        await socket.emit('serverError', genMessage.desc)
      } else {
        try {
          let savedMessage = await genMessage.result.save();
          savedMessage = await normalizeMessage(savedMessage);
          const room = Object.keys(socket.rooms)[0];
          await io.sockets.broadcast.in(room).emit('message', savedMessage)
        } catch (e) {
          await socket.emit('error', e)
        }
      }
    })

    socket.on('typing', async (isTyping) => {
      console.log(isTyping)
      const room = Object.keys(socket.rooms)[0];
      socket.broadcast.in(room).emit('typing', isTyping)
    })

    socket.on('join', (threadId) => {
      if(socket.rooms) socket.leaveAll()

      socket.join(threadId)
    })

  })
}
