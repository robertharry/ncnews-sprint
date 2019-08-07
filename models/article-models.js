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
    .increment('votes', body.inc_votes || 0)
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
};

exports.selectCommentsByArticleId = (article_id, sort_by, order) => {
    return connection
    .select('comments.comment_id', 
    'comments.author', 
    'comments.created_at', 
    'comments.votes', 
    'comments.body')
    .from('comments')
    .join('articles', 'comments.article_id', 'articles.article_id', )
    .groupBy('comments.comment_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .where('comments.article_id', article_id)
    .returning('*')
    .then(article => {
        if(!article.length){
            return Promise.reject({status: 404, msg: 'Article not found'})
        } else return article
    })

};

exports.selectAllArticles = (sort_by, order, author, topic) => {
    return connection 
    .select('articles.author', 'articles.title', 'articles.article_id', 'articles.topic', 'articles.created_at', 'articles.votes')
    .from('articles')
    .count({comment_count: 'comments'})
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by || 'created_at', order || 'desc')
    .modify((query) => {
        if(author){
            query.where('articles.author', author)
        }if(topic) {
            query.where('articles.topic', topic)
        }
    })
    .then(articles => {
        if(!articles.length && author){
            return Promise.reject({status: 404, msg: 'Author not found'})
        } else if(!articles.length && topic){
            return Promise.reject({status: 404, msg: 'Topic not found'})
        }return articles
    })
};