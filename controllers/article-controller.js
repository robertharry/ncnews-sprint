const {selectArticle} = require('../models/article-models')

exports.getArticleById = (req, res, next) => {
    const {article_id} = req.params
    selectArticle(article_id)
    .then(([article]) => {
        res.status(200).send({article})
    })
    .catch(next)
};