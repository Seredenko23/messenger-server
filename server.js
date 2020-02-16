require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')
const usersRoutes = require('./routes/users')

const MONGO_URL = process.env.MONGO_URL
const port = process.env.PORT
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/users', usersRoutes)

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
