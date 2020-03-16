const Message = require('../models/Message')
const Thread = require('../models/Thread')

async function generateMessage(message) {
  const genMessage = new Message({
    threadId: message.threadId,
    user: message.user,
    messageBody: message.messageBody,
    createdAt: Date.now()
  })

  const error = genMessage.validateSync();
  if(error) return {type: 'error', status: 400, desc: 'Invalid user'};

  try {
    const userExistInThread = await Thread.find({_id: message.threadId, users: message.user}).exec()
    if (!userExistInThread) {
      console.log(userExistInThread, "isUserExist");
      return {type: 'error', status: 400, desc: 'User doesn`t exist in thread'}
    }
  } catch (e) {
    return {type: 'error', status: 500, desc: e}
  }

  return {type: 'success', status: 200, result: genMessage};
}

function normalizeMessage(message)  {
  message = message.toObject();
  message._id = message._id.toString();
  message.user._id = message.user._id.toString();
  message.messageBody.body = message.messageBody.body.toString('base64');
  return message
}

module.exports.generateMessage = generateMessage
module.exports.normalizeMessage = normalizeMessage
