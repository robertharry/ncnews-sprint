const usersRouter = require('express').Router();
const {getUserById} = require('../controllers/user-controller')

usersRouter.route('/:username').get(getUserById)

module.exports = usersRouter;