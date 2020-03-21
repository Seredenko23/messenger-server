const router = require('express').Router()
const { getThread,
        createThread,
        deleteThread } = require('../controller/thread')

router.get("/thread/:id", (req, res) => {
  getThread(res, req)
});

router.post("/thread", (req, res) => {
  createThread(res, req)
});

router.delete('/thread/:id', (req, res) => {
  deleteThread(res, req)
})

module.exports = router;
