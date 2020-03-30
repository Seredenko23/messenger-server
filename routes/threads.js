const router = require('express').Router()
const { authentificateToken } = require('../service/token')
const { getThread,
        createThread,
        deleteThread } = require('../controller/thread')

router.get("/thread/:id", authentificateToken, (req, res) => {
  getThread(req, res)
});

router.post("/thread", authentificateToken, (req, res) => {
  createThread(req, res)
});

router.delete('/thread/:id', authentificateToken, (req, res) => {
  deleteThread(req, res)
})

module.exports = router;
