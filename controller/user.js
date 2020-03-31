const escapeStringRegexp = require('escape-string-regexp')
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../service/validation')
const { authentificateToken, generateAccessToken } = require('../service/token')
const ObjectID = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')

function getUsers(req, res) {
  let query = {}

  console.log(req.query.search)
  if (req.query.search) {
    let searchRegExp = new RegExp(`${escapeStringRegexp(req.query.search)}`)
    query.$or = [
      {
        firstName: searchRegExp
      },
      {
        lastName: searchRegExp
      }
    ]
  }

  User.find(query)
    .exec((err, docs) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500).send(err.details[0].message)
      }
      res.send(docs)
    })
}

function getUserById(req, res) {
  const id = req.params.id;
  User.findById(id)
    .exec()
    .then(doc => {
      console.log(doc);
      res.status(200).json(doc);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err.details[0].message)
    })
}

async function createUser(req, res) {
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
}

function deleteUser(req, res) {
  User.deleteOne(
    { _id: ObjectID(req.params.id) },
    (err, result) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500).send(err.details[0].message)
      }
      res.sendStatus(200)
    })
}

function generateNewRefreshToken(req, res) {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ _id: user._id })
    res.header('Authorization', `Bearer ${accessToken}`)
    res.json({})
  })
}

async function loginUser(req, res) {
  const { error } = loginValidation(req.body)
  if(error) return res.status(400).send(JSON.stringify(error.details[0].message))
  console.log(error)

  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send(JSON.stringify('Invalid email'))

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).send(JSON.stringify('Invalid password'))

  let token = generateAccessToken({_id: user._id})
  console.log(user);
  const refreshToken = jwt.sign({_id: user._id}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"})
  res.header('Access-Control-Expose-Headers', 'access-token, refresh-token')
  res.header('access-token', token);
  res.header('refresh-token', refreshToken);
  res.send(user)
  // const accessToken = generateAccessToken(user)
  // refreshTokens.push(refreshToken)
  // res.json({ accessToken: accessToken, refreshToken: refreshToken })
}

module.exports.getUsers = getUsers;
module.exports.getUserById = getUserById;
module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.generateNewRefreshToken = generateNewRefreshToken;
module.exports.loginUser = loginUser;
