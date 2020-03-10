const router = require('express').Router()
const Thread = require('../models/Thread')
const User = require('../models/User')
const ObjectID = require('mongodb').ObjectID

router.get("/thread/:id", (req, res) => {
  const userId = req.params.id;
  console.log(userId)
  Thread.find({ "users._id": userId}, (err, threads) => {
    if(err) return res.status(400).send(err);
    console.log(threads)
    res.status(200).send(threads);
  })
});

router.post("/thread", async (req, res) => {
  const curUser = await User.findOne({_id: req.body.currentUser}).exec()

  const user = await User.findOne({_id: req.body.user}).exec()

  if(!user || !curUser) return res.sendStatus(400)

  const thread = new Thread({
    users: [ curUser, user ]
  });

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
