const {selectUserById} = require('../models/user-models')


exports.getUserById = (req, res, next) => {
    const {username} = req.params
    selectUserById(username)
    .then(([user]) => {
        if(user === undefined){ return Promise.reject({status: 404, msg: 'Not found'}) }
        res.status(200).send({user})
    })
    .catch(next)
}