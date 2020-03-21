const router = require('express').Router()
const { getUsers,
        getUserById,
        createUser,
        deleteUser,
        generateNewRefreshToken,
        loginUser} = require('../controller/user')

router.get('/users', (req, res) => {
  getUsers(req, res)
});

router.get('/users/:id', (req, res) => {
  getUserById(req, res)
});

router.post('/users', (req, res) => {
  createUser(req, res)
});

router.delete('/users/:id', (req, res) => {
  deleteUser(req, res)
});

// Refresh by token
router.post('/token', (req, res) => {
  generateNewRefreshToken(req, res)
});

router.post('/login', async (req, res) => {
  loginUser(req, res)
});

module.exports = router;
