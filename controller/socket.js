const io = require('socket.io')

io.on('connection', (socket) => {
  //TODO on connection send user message
  socket.on('message', (message) => {
    //TODO send message to db
    const room = Object.keys(socket.rooms)[1];
    socket.broadcast.to(room).emit('message', message)
  })

  socket.join('join', (threadId) => {
    if(socket.rooms) socket.leaveAll()

    socket.join(threadId)
  })
})

/*We will use thread id for room names*/
