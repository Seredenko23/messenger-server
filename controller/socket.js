const { generateMessage } = require('../controller/message')

module.exports = function(io) {
  io.on('connection', (socket) => {

    socket.on('message', async (message) => {
      let genMessage = await generateMessage(message);
      if (genMessage.type === 'error') {
        await socket.emit('serverError', genMessage.desc)
      } else {
        try {
          let savedMessage = await genMessage.result.save();
          savedMessage = await savedMessage.toObject();
          savedMessage._id = savedMessage._id.toString();
          savedMessage.user._id = savedMessage.user._id.toString();
          savedMessage.messageBody.body = savedMessage.messageBody.body.toString('base64');
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
