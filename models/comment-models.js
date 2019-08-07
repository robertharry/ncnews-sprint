const connection = require('../db/connection');

exports.updateComment = (comment_id, body) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .increment('votes', body.inc_votes || 0)
        .returning('*')
        .then(comment => {
            if (!comment.length) {
                return Promise.reject({ status: 404, msg: 'Comment not found' })
            } else return comment
        })
};

exports.removeComment = (comment_id) => {
    return connection
        .select('*')
        .from('comments')
        .where('comment_id', comment_id)
        .del()
        .then(comment => {
            if (comment === 1) {
                return comment
            } else if (comment === 0) {
                return Promise.reject({ status: 404, msg: 'Comment not found' })
            }
        })
}