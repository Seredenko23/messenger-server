const router = require('express').Router()
const { getMetadata } = require('../controller/scrapUrl')

router.post("/url", async (req, res) => {
  getMetadata(req, res)
});

module.exports = router
