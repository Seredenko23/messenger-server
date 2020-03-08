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
          const room = Object.keys(socket.rooms)[1];
          console.log(savedMessage)
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
