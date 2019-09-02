const { selectUserById,selectAllUsers } = require('../models/user-models')


exports.getUserById = (req, res, next) => {
    const { username } = req.params
    selectUserById(username)
        .then(([user]) => {
            res.status(200).send({ user })
        })
        .catch(next)
};

exports.getAllUsers = (req, res, next) => {
    selectAllUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}