const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const { registerValidation, loginValidation } = require('../controller/validation')
const { authentificateToken, generateAccessToken } = require('../controller/token')
const ObjectID = require('mongodb').ObjectID
const jwt = require('jsonwebtoken')

router.get('/users', (req, res) => {
  User.find()
    .exec((err, docs) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500).send(err.details[0].message)
      }
      res.send(docs)
    })
})

router.get('/users/:id', (req, res) => {
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
})

router.post('/users', async (req, res) => {
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

// router.put('/users/:id', (req, res) => {
//   db.collection('users').update(
//     { _id: ObjectID(req.params.id) },
//     { email: req.body.email },
//     function (err, result) {
//       if (err) {
//         console.log(err)
//         return res.sendStatus(500)
//       }
//       res.sendStatus(200)
//     }
//   )
// })

router.delete('/users/:id', (req, res) => {
  User.deleteOne(
    { _id: ObjectID(req.params.id) },
    (err, result) => {
      if (err) {
        console.log(err)
        return res.sendStatus(500).send(err.details[0].message)
      }
      res.sendStatus(200)
    })
})

// Refresh by token
router.post('/token', (req, res) => {
  const refreshToken = req.body.token
  if (refreshToken == null) return res.sendStatus(401)
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    const accessToken = generateAccessToken({ _id: user._id })
    res.header('Authorization', `Bearer ${accessToken}`)
    res.json({})
  })
})

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body)
  if(error) return res.status(400).send(error.details[0].message)

  const user = await User.findOne({email: req.body.email})
  if (!user) return res.status(400).send('Invalid email')

  const validPass = await bcrypt.compare(req.body.password, user.password)
  if(!validPass) return res.status(400).send('Invalid password')

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
})

module.exports = router;
