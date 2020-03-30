const router = require('express').Router()
const { getMetadata } = require('../controller/scrapUrl')
const { authentificateToken } = require('../service/token')


router.post("/url", authentificateToken, (req, res) => {
  getMetadata(req, res)
});

module.exports = router
