const {selectArticle, updateArticle, insertComment, selectCommentsByArticleId, selectAllArticles} = require('../models/article-models')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticle(article_id)
    .then(([article]) => {
        res.status(200).send({article})
    })
    .catch(next)
};

exports.patchArticle = (req, res, next) => {
    const {article_id} = req.params
    const body = req.body
    updateArticle(article_id, body)
    .then(([article]) => {
        res.status(201).send({article})
    })
    .catch(next)
};

exports.postComment = (req, res, next) => {
    const {article_id} = req.params
    const body = req.body
    insertComment(article_id, body)
    .then(([comment]) => {
        res.status(201).send({comment})
    })
    .catch(next)
};

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    const {sort_by, order} = req.query
    selectCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
        res.status(200).send({comments})
    })
    .catch(next)
};

exports.getAllArticles = (req, res, next) => {
    selectAllArticles()
    .then(articles => {
        res.status(200).send({articles})
    })
    .catch(next)
};