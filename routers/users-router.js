const usersRouter = require('express').Router();
const {getUserById, getAllUsers} = require('../controllers/user-controller');
const {send405Error} = require('../errors/index')

usersRouter.route('/').get(getAllUsers)
usersRouter.route('/:username').get(getUserById).all(send405Error)


module.exports = usersRouter;