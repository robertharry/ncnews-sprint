const endpoints = require('../endpoints.json')

exports.sendApiRoutes = (req, res, next) => {
    res.status(200).send(endpoints)
}