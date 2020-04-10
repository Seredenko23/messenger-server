const Thread = require('../models/Thread')
const User = require('../models/User')
const ObjectId = require('mongodb').ObjectId

async function getThread(req, res) {
  const userId = req.params.id;
  try {
    const threads = await Thread.find({ "users": userId }).populate('users').exec()

    res.status(200).send(threads);
  } catch (err) {
    res.status(400).send(err);
  }
}

async function createThread(req, res) {
  const curUser = await User.findById(req.body.currentUser).exec()

  const user = await User.findById(req.body.user).exec()

  console.log(curUser)

  if(!user || !curUser) return res.sendStatus(400)

  const thread = new Thread({
    users: [ req.body.currentUser, req.body.user ]
  });

  console.log(thread);
  try {
    const savedThread = await thread.save()
    let normalizedThread = await Thread.findById(savedThread._id).populate('users').exec()
    res.send(normalizedThread)
  } catch (e) {
    res.status(400).send(e)
  }
}

function deleteThread(res, req) {
  Thread.deleteOne({_id: ObjectId(req.params.id)}, (err, result) => {
    if(err) {
      console.log(err)
      return res.sendStatus(500).send(err.details[0].message)
    }
    res.sendStatus(200)
  })
}

module.exports.getThread = getThread;
module.exports.createThread = createThread;
module.exports.deleteThread = deleteThread;
