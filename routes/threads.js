const router = require('express').Router()
const { getThread,
        createThread,
        deleteThread } = require('../controller/thread')

router.get("/thread/:id", (req, res) => {
  console.log(req.params.id)
  getThread(req, res)
});

router.post("/thread", (req, res) => {
  createThread(req, res)
});

router.delete('/thread/:id', (req, res) => {
  deleteThread(req, res)
})

module.exports = router;
