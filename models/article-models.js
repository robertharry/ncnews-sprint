const connection = require('../db/connection')
const {formatOneComment} = require('../db/utils/utils')

exports.selectArticle = (article_id) => {
    return connection
    .select('articles.*')
    .from('articles')
    .count({comment_count: 'comments'})
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then(article => {
        if(!article.length){
            return Promise.reject({status: 404, msg: 'Article not found'})
        } else return article
    })
};

exports.updateArticle = (article_id, body) => {
    return connection
    .select('*')
    .from('articles')
    .where('article_id', article_id)
    .increment('votes', body.inc_votes)
    .returning('*')
    .then(article => {
        if(!article.length){
            return Promise.reject({status: 404, msg: 'Article not found'})
        } else return article
    })
};

exports.insertComment = (article_id, body) => {
    const newBody = formatOneComment(body, article_id)
    return connection('comments')
    .join('articles', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .insert(newBody)
    .returning('*')
    .then(comment => {
       // console.log(comment)
        if(!comment.length){
            return Promise.reject({status: 404, msg: 'Article not found'})
        } else return comment
    })
};