const router = require('express').Router()
const { getMessages,
        createMessage,
        deleteMessage } = require("../controller/message");

router.get("/message/:id", async (req, res) => {
  getMessages(req, res)
});

router.post("/message", async (req, res) => {
  createMessage(req, res)
});

router.delete('/message/:id', (req, res) => {
  deleteMessage(req, res)
})

module.exports = router;
