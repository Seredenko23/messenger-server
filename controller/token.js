const jwt = require('jsonwebtoken')

function authentificateToken (req, res, next) {
  const token = req.headers.authorization
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

function generateAccessToken (user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' })
}

module.exports.authentificateToken = authentificateToken;
module.exports.generateAccessToken = generateAccessToken;
