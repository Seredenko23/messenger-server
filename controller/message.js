const Message = require('../models/Message')
const Thread = require('../models/Thread')

async function generateMessage(message) {
  const genMessage = new Message({
    threadId: message.threadId,
    user: message.user,
    messageBody: message.messageBody
  })

  const error = genMessage.validateSync();
  if(error) return {type: 'error', status: 400, desc: 'Invalid user'};

  try {
    const userExistInThread = await Thread.findOne({_id: message.threadId, users: message.user._id}).exec()
    if (!userExistInThread) {
      console.log(userExistInThread, "isUserExist");
      return {type: 'error', status: 400, desc: 'User doesn`t exist in thread'}
    }
  } catch (e) {
    return {type: 'error', status: 500, desc: 'Server error'}
  }

  return {type: 'success', status: 200, result: genMessage};
}

module.exports.generateMessage = generateMessage
