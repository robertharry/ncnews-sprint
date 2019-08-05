const topicsRouter = require('express').Router();
const {getTopics} = require('../controllers/topic-controller')

topicsRouter.route('/').get(getTopics)


module.exports = topicsRouter