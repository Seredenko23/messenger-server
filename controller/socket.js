const io = require('socket.io')
const { generateMessage } = require('../controller/message')

io.on('connection', (socket) => {
  socket.on('message', async (message) => {
    let genMessage = await generateMessage(message);
    if (genMessage.type === 'error') {
      socket.emit('error', genMessage.desc)
    } else {
      try {
        const savedMessage = await message.result.save()
        const room = Object.keys(socket.rooms)[1];
        socket.broadcast.to(room).emit('message', savedMessage)
      } catch (e) {
        socket.emit('error', e)
      }
    }
  })

  socket.join('join', (threadId) => {
    if(socket.rooms) socket.leaveAll()

    socket.join(threadId)
  })
})

/*We will use thread id for room names*/
