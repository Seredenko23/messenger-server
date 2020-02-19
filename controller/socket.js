const io = require('socket.io')

io.on('connection', (socket) => {
  //TODO on connection send user message
  socket.on('message', (message) => {
    //TODO send message to db
    socket.broadcast.emit('message', message)
  })
})

/*We will use thread id for room names*/
