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
          savedMessage = await normalizeMessage(savedMessage)
          const room = Object.keys(socket.rooms)[0];
          console.log(socket.rooms)
          await io.sockets.in(room).emit('message', savedMessage)
        } catch (e) {
          await socket.emit('error', e)
        }
      }
    })

    socket.on('join', (threadId) => {
      if(socket.rooms) socket.leaveAll()
      console.log(threadId)

      socket.join(threadId)
    })

  })
}

/*We will use thread id for room names*/
