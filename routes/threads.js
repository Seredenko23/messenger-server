const router = require('express').Router()
const Thread = require('../models/Thread')
const ObjectID = require('mongodb').ObjectID

router.get("/thread/:id", (req, res) => {
  const userId = req.params.id;
  Thread.find({ users: userId }, (err, threads) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(threads);
  })
});

router.post("/thread", async (req, res) => {
  const thread = new Thread({
    users: [ req.body.currentUser, req.body.user ]
  })
  console.log(thread);
  try {
    const savedThread = await thread.save()
    res.send(savedThread)
  } catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/thread/:id', (req, res) => {
  Thread.deleteOne(
    {_id: ObjectID(req.params.id)},
    (err, result) => {
    if(err) {
      console.log(err)
      return res.sendStatus(500).send(err.details[0].message)
    }
    res.sendStatus(200)
  })
})

module.exports = router;
