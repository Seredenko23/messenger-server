const router = require('express').Router()
const Message = require('../models/Message')
const { generateMessage } = require('../controller/message')
const ObjectID = require('mongodb').ObjectID

router.get("/message/:id", (req, res) => {
  const threadId = req.params.id;
  Message.find({ threadId: threadId }, (err, threads) => {
    if(err) return res.status(400).send(err);
    res.status(200).send(threads);
  })
});

router.post("/message", async (req, res) => {
  const message = await generateMessage(req.body)

  if(message.type === 'error') return res.status(message.status).send(message.desc)

  const error = message.validateSync();
  if(error) return res.sendStatus(400)

   try {
     const userExistInThread = await Thread.findOne({_id: req.body.threadId, users: req.body.user._id}).exec()
     if (!userExistInThread) {
       console.log(userExistInThread, "isUserExist");
       return res.sendStatus(400)
     }
   } catch (e) {
     return res.sendStatus(500)
   }

  try {
    const savedMessage = await message.result.save()
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
