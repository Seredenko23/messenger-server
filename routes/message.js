const router = require('express').Router()
const { authentificateToken } = require('../service/token')
const { getMessages,
        createMessage,
        deleteMessage } = require("../controller/message");

router.get("/message/:id", authentificateToken, (req, res) => {
  getMessages(req, res)
});

router.post("/message", authentificateToken, (req, res) => {
  createMessage(req, res)
});

router.delete('/message/:id', authentificateToken, (req, res) => {
  deleteMessage(req, res)
})

module.exports = router;
