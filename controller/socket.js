const { generateMessage } = require('../controller/message')

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('message', async (message) => {
      let genMessage = await generateMessage(message);
      if (genMessage.type === 'error') {
        await socket.emit('serverError', genMessage.desc)
      } else {
        try {
          const savedMessage = await genMessage.result.save()
          const room = Object.keys(socket.rooms)[1];
          await io.emit('message', savedMessage)
        } catch (e) {
          await socket.emit('error', e)
        }
      }
    })

    socket.join('join', (threadId) => {
      if(socket.rooms) socket.leaveAll()

      socket.join(threadId)
    })

  })
}

/*We will use thread id for room names*/
