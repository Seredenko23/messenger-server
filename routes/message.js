const router = require('express').Router()
const Message = require('../models/Message')
const ObjectID = require('mongodb').ObjectID

router.get("/message/:id", (req, res) => {
  const threadId = req.params.id;
  Message.find({ threadId: threadId }, (err, threads) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(threads);
  })
});

router.post("/message", async (req, res) => {
  //TODO check if user in thread
  //TODO check if user correct
  const message = new Message({
    threadId: req.body.threadId,
    user: req.body.user,
    messageBody: req.body.messageBody
  })
  console.log(message);
  try {
    const savedMessage = await message.save()
    res.send(savedMessage)
  } catch (e) {
    res.status(400).send(e)
  }
});

router.delete('/message/:id', (req, res) => {
  Message.deleteOne(
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
