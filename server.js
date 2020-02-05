require('dotenv').config()

const express = require('express')
const bodyParser = require('body-parser')
const ObjectID = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('./controller/validation')

const MONGO_URL = process.env.MONGO_URL
const port = process.env.PORT
const app = express()
let db
const refreshTokens = []

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/users', authentificateToken,(req, res) => {
  // db.collection('users').find().toArray((err, docs) => {
  //   if (err) {
  //     console.log(err)
  //     return res.sendStatus(500)
  //   }
  //   res.send(docs)
  // })
  res.send('great')
})

app.get('/users/:id', (req, res) => {
  db.collection('users').findOne({ _id: ObjectID(req.params.id) }, (err, doc) => {
    if (err) {
      console.log(err)
      return res.sendStatus(500)
    }
    res.send(doc)
  })
})

app.post('/users', async (req, res) => {

  const { error } = registerValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const emailExist = await User.findOne({email: req.body.email})
  if (emailExist) return res.status(400).send('Email already exist')

  const salt = await bcrypt.genSalt(10)
  const hashPassword = await bcrypt.hash(req.body.password, salt)

  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    username: req.body.username,
    email: req.body.email,
    password: hashPassword
  })

  try {
    const savedUser = await user.save()
    res.send(savedUser)
  } catch (e) {
    res.status(400).send(e)
  }
})

app.put('/users/:id', (req, res) => {
  db.collection('users').update(
    { _id: ObjectID(req.params.id) },
    { email: req.body.email },
    function (err, result) {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }
      res.sendStatus(200)
    }
  )
})

app.delete('/users/:id', (req, res) => {
  db.collection('users').deleteOne(
    { _id: ObjectID(req.params.id) },
    function (err, result) {
      if (err) {
        console.log(err)
        return res.sendStatus(500)
      }
      res.sendStatus(200)
    })
})

// Refresh by token
app.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    console.log(user)
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ name: user.username })
    res.json({ accessToken: accessToken })
  })
})

app.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Invalid email')

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).send('Invalid password')

  let token = generateAccessToken({_id: user._id})
  res.header('Authorization', `Bearer ${token}`);
  res.send(user)
  // const accessToken = generateAccessToken(user)
  // const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
  // refreshTokens.push(refreshToken)
  // res.json({ accessToken: accessToken, refreshToken: refreshToken })
})

function authentificateToken (req, res, next) {
  const authHeader = req.headers.authorization
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' })
}

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
