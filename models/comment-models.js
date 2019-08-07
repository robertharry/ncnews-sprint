const connection = require('../db/connection');

exports.updateComment = (comment_id, body) => {
    return connection
    .select('*')
    .from('comments')
    .where('comment_id', comment_id)
    .increment('votes', body.inc_votes)
    .returning('*')
    .then(article => {
        if(!article.length){
            return Promise.reject({status: 404, msg: 'Comment not found'})
        } else return article
    })
};

exports.removeComment = (comment_id) => {
    return connection 
    .select('*')
    .from('comments')
    .where('comment_id', comment_id)
    .del()
}