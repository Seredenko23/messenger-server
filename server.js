require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

const usersRoutes = require('./routes/users')
const threadsRouters = require('./routes/threads')
const messageRouter = require('./routes/Message')

const MONGO_URL = process.env.MONGO_URL
const port = process.env.PORT
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api', usersRoutes)
app.use('/api', threadsRouters)
app.use('/api', messageRouter)

mongoose.connect(MONGO_URL,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err, database) => {
    if (err) {
      return console.log(err)
    }
    app.listen(port, () => {
      console.log(`Server is listening on port: ${9000}`)
    })
  })
