const {updateComment, removeComment} = require('../models/comment-models')

exports.patchComment = (req, res, next) => {
    const {comment_id} = req.params;
    const body = req.body;
    updateComment(comment_id, body)
    .then(([comment]) => {
        res.status(200).send({comment})
    })
    .catch(next)
};

exports.deleteComment = (req, res, next) => {
    const {comment_id} = req.params;
    removeComment(comment_id)
    .then(comment => {
        res.sendStatus(204)
    })
    .catch(next)
}